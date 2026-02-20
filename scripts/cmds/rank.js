const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
let loadImage, createCanvas, registerFont;
let canvasAvailable = false;

try {
  const canvas = require("canvas");
  loadImage = canvas.loadImage;
  createCanvas = canvas.createCanvas;
  registerFont = canvas.registerFont;
  canvasAvailable = true;
} catch (error) {
  console.error("Canvas non disponible :", error.message);
}

// --- CONFIGURATION DES THÈMES (Style Pair) ---
const rankThemes = {
  galaxy: {
    name: "Nébuleuse Royale",
    background: (ctx, width, height) => {
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
      gradient.addColorStop(0, "#2d3436");
      gradient.addColorStop(0.5, "#636e72");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    accent: "#a29bfe",
    secondary: "#6c5ce7",
    glow: "rgba(108, 92, 231, 0.8)",
    textColor: "#ffffff"
  },
  emerald: {
    name: "Forêt Enchantée",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#00b894");
      gradient.addColorStop(1, "#006266");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    accent: "#55efc4",
    secondary: "#00b894",
    glow: "rgba(0, 184, 148, 0.8)",
    textColor: "#ffffff"
  }
};

// --- FONCTIONS DE DESSIN AVANCÉES ---
function drawRankFrame(ctx, x, y, size, theme) {
  const centerX = x + size/2;
  const centerY = y + size/2;
  const radius = size/2;

  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 30;
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
  ctx.stroke();

  // Particules autour de l'avatar
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const px = centerX + Math.cos(angle) * (radius + 25);
    const py = centerY + Math.sin(angle) * (radius + 25);
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function drawProgressBar(ctx, x, y, w, h, percentage, theme) {
  // Fond de la barre
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h/2);
  ctx.fill();

  // Remplissage avec dégradé
  const gradient = ctx.createLinearGradient(x, y, x + w, y);
  gradient.addColorStop(0, theme.secondary);
  gradient.addColorStop(1, theme.accent);
  
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 15;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x, y, (w * percentage) / 100, h, h/2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

module.exports = {
  config: {
    name: "rank",
    author: "Christus",
    role: 0,
    description: "Affiche ton niveau avec un design magique",
    category: "system",
    guide: { en: "rank [mention ou vide]" }
  },

  onStart: async function ({ api, event, args, usersData, Currencies }) {
    if (!canvasAvailable) return api.sendMessage("❌ Canvas non installé.", event.threadID);

    try {
      const targetID = Object.keys(event.mentions)[0] || event.senderID;
      const userData = await usersData.get(targetID);
      const allUsers = await usersData.getAll();
      
      // Calcul du rang
      const sortedUsers = allUsers.sort((a, b) => (b.exp || 0) - (a.exp || 0));
      const rankIndex = sortedUsers.findIndex(u => u.userID == targetID) + 1;
      
      const exp = userData.exp || 0;
      const level = Math.floor(Math.sqrt(1 + (4 * exp) / 3 + 1) / 2);
      const nextLevelExp = 3 * level * (level + 1);
      const percentage = Math.min(Math.floor((exp / nextLevelExp) * 100), 100);

      const theme = rankThemes.galaxy; // On peut randomiser ici
      const width = 1000;
      const height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // 1. Fond
      theme.background(ctx, width, height);

      // 2. Décorations (Particules)
      for(let i=0; i<50; i++) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(Math.random()*width, Math.random()*height, Math.random()*3, 0, Math.PI*2);
        ctx.fill();
      }

      // 3. Avatar
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarBuf = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
      const avatarImg = await loadImage(Buffer.from(avatarBuf));

      const avSize = 200;
      const avX = 50, avY = height/2 - avSize/2;
      
      drawRankFrame(ctx, avX, avY, avSize, theme);
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX + avSize/2, avY + avSize/2, avSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avX, avY, avSize, avSize);
      ctx.restore();

      // 4. Textes et Infos
      ctx.textAlign = "left";
      ctx.fillStyle = theme.textColor;
      
      // Nom de l'utilisateur
      ctx.font = "bold 50px Arial";
      ctx.fillText(userData.name, avX + avSize + 50, 130);

      // Niveau et Rang
      ctx.font = "30px Arial";
      ctx.fillText(`NIVEAU : ${level}`, avX + avSize + 50, 190);
      ctx.textAlign = "right";
      ctx.fillText(`RANG : #${rankIndex}`, width - 70, 190);

      // 5. Barre de Progression
      drawProgressBar(ctx, avX + avSize + 50, 230, 600, 40, percentage, theme);
      
      // Texte d'EXP
      ctx.textAlign = "center";
      ctx.font = "20px Arial";
      ctx.fillText(`${exp} / ${nextLevelExp} EXP`, avX + avSize + 350, 310);

      const pathImg = path.join(__dirname, "cache", `rank_${targetID}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(pathImg, canvas.toBuffer());

      return api.sendMessage({
        body: `⭐ 𝑹𝒂𝒏𝒌 𝒅𝒆 ${userData.name}\n🏆 𝑷𝒐𝒔𝒊𝒕𝒊𝒐𝒏 : ${rankIndex}/${allUsers.length}\n📈 𝑷𝒓𝒐𝒈𝒓𝒆𝒔𝒔𝒊𝒐𝒏 : ${percentage}%`,
        attachment: fs.createReadStream(pathImg)
      }, event.threadID, () => fs.unlinkSync(pathImg));

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ Erreur lors de la génération du Rank.", event.threadID);
    }
  }
};
