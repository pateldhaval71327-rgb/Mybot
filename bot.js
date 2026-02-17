 require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

// --- 🛠️ SETUP & ANTI-CRASH ---
const bot = new Telegraf(process.env.MANAGER_BOT_TOKEN);

// Global Error Handler
bot.catch((err) => {
    console.log(`⚠️ Telegram Error (Ignored): ${err.message}`);
});

let BOT_USERNAME = '';

// --- 🔗 CONFIGURATION ---
const CONFIG = {
    website: "https://stallion.exchange",
    register: "https://www.stallion.exchange/index.html?0xb7e912c5b4fb538088ea4a23a59a2261421157e2", 
    whitepaper: "https://stallion.exchange/assets/indexpdf/STALLIONEXCHANGEWhitePaper.pdf",
    audit: "https://stallion.exchange/assets/indexpdf/auditreport.pdf",
    roadmapPdf: "https://stallion.exchange/assets/indexpdf/Roadmapstallionexchange.pdf",
    faqPdf: "https://stallion.exchange/assets/indexpdf/StallionExchangeFAQs.pdf",
    channel: "@profittradercrypto", // Aapka Public Channel
    support: "@Profitcrypto_traderbot",
    video: "https://youtube.com/shorts/Z97xhOvQhmg?si=0uCFqYZsL4vXgm8i",
    logo: "https://stallion.exchange/assets/images/logo.png"
};

// --- 🎨 HELPER: Back Button ---
const backButton = Markup.inlineKeyboard([
    [Markup.button.callback('🔙 Back to Main Menu', 'SHOW_MENU')]
]);

// --- 1. MAIN MENU SYSTEM ---
const sendMainMenu = async (ctx) => {
    const menuText = `
📘 **MAIN MENU • STALLION EXCHANGE**
━━━━━━━━━━━━━━━━━━━━━
*Select a topic to learn more:*

💎 **Why Stallion?**
✅ **Buy** = Supply Up (Mint)
✅ **Sell** = Supply Down (Burn)
✅ **Auto-Liquidity** Locked
    `;
    const menuButtons = Markup.inlineKeyboard([
    [
        Markup.button.callback('ℹ️ About Us', 'ABOUT'), 
        Markup.button.callback('💰 How to Buy', 'BUY')
    ],
    [
        Markup.button.callback('📝 Register', 'SHOW_REGISTER'), 
        Markup.button.callback('📞 Support', 'SUPPORT')
    ],
    [
        Markup.button.callback('📄 Whitepaper', 'PAPER'), 
        Markup.button.callback('🛡 Audit Report', 'AUDIT')
    ],
    [
        Markup.button.callback('🗺 Roadmap', 'MAP'), 
        Markup.button.callback('❓ FAQs', 'FAQ')
    ],
    [
        Markup.button.url('🌐 Visit Website', CONFIG.website)
    ]
]);

    try {
        if (ctx.callbackQuery) {
            await ctx.editMessageText(menuText, { parse_mode: 'Markdown', ...menuButtons });
        } else {
            await ctx.replyWithPhoto(CONFIG.logo, { caption: menuText, parse_mode: 'Markdown', ...menuButtons });
        }
    } catch (e) {
        if (!ctx.callbackQuery) ctx.replyWithMarkdown(menuText, menuButtons);
    }
};

// Start Command
bot.start((ctx) => {
    // Check agar koi specific start payload hai (e.g., /start buy)
    const payload = ctx.payload;
    if (payload === 'buy') return showBuy(ctx);
    if (payload === 'register') return showRegister(ctx);
    
    sendMainMenu(ctx);
});

// Action Handler for Menu
bot.action('SHOW_MENU', (ctx) => sendMainMenu(ctx));


// --- 2. DETAILED INFO FUNCTIONS ---

// ℹ️ ABOUT US
bot.action('ABOUT', (ctx) => {
    const text = `
ℹ️ **ABOUT THE PROJECT**
━━━━━━━━━━━━━━━━━━━━━
**Stallion Exchange** is a revolutionary decentralized protocol on **Polygon**.

⚙️ **Core Mechanism:**
🔹 **Minting:** Buy = New tokens created.
🔹 **Burning:** Sell = Tokens destroyed forever.
🔹 **Liquidity:** Auto-locked on every trade.

💎 **Entry:** Start with just **$1**
    `;
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
});

// 💰 HOW TO BUY (Detailed Version)
const showBuy = (ctx) => {
    const text = `
💰 **HOW TO BUY STALLION TOKENS**
━━━━━━━━━━━━━━━━━━━━━
Invest in just a few simple steps:

1️⃣ **Register & Join**
Click [Join Now] inside the DApp.

2️⃣ **Click Buy**
Tap the **[BUY]** button on the dashboard.

3️⃣ **Enter Amount**
Minimum investment: **$1 USDT**

4️⃣ **Connect Wallet**
Use any Polygon-supported wallet:

🔹 **MetaMask:** [Download](https://metamask.app.link)
🔹 **Trust Wallet:** [Download](https://link.trustwallet.com)
🔹 **TokenPocket:** [Android](https://play.google.com/store/apps/details?id=vip.mytokenpocket) | [iOS](https://apps.apple.com/app/tokenpocket/id6444625622)

👉 Always use the official link inside DApp Browser.

5️⃣ **Approve & Confirm**
Approve the transaction. Tokens will be minted instantly!
    `;
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', disable_web_page_preview: true, ...backButton }).catch(() => {});
    else ctx.replyWithMarkdown(text, { disable_web_page_preview: true, ...backButton });
};
bot.action('BUY', (ctx) => showBuy(ctx));

// 📝 REGISTRATION (Detailed Version)
const showRegister = async (ctx) => {

    const userId = ctx.from.id;
    const referralLink = `${CONFIG.register}&ref=${userId}`;

    const text = `
📝 *REGISTRATION GUIDE*
━━━━━━━━━━━━━━━━━━━━━

1️⃣ Install MetaMask / TrustWallet / TokenPocket  
2️⃣ Switch Network to *Polygon*  
3️⃣ Keep $0.10 POL for gas  
4️⃣ Open DApp Browser  
5️⃣ Paste link below & Connect Wallet  

🔗 *Your Referral Link (Tap & Hold to Copy):*

\`\`\`
${referralLink}
\`\`\`

 `;

    const regButtons = Markup.inlineKeyboard([
        
        [
            Markup.button.callback('🔙 Back', 'SHOW_MENU')
        ]
    ]);

    if (ctx.callbackQuery) {
        await ctx.editMessageText(text, { 
            parse_mode: 'Markdown', 
            reply_markup: regButtons.reply_markup 
        }).catch(() => {});
    } else {
        await ctx.reply(text, { 
            parse_mode: 'Markdown', 
            reply_markup: regButtons.reply_markup 
        });
    }
};

bot.action('SHOW_REGISTER', async (ctx) => {
    await ctx.answerCbQuery();
    await showRegister(ctx);
});
// 📞 SUPPORT
bot.action('SUPPORT', (ctx) => {
    const text = `📞 **SUPPORT**\n\nChannel: ${CONFIG.channel}\nAdmin: ${CONFIG.support}\n\n⚠️ Admin will never DM first.`;
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
});

// 📄 WHITEPAPER
bot.action('PAPER', (ctx) => {
    ctx.editMessageText(`📄 **TECHNICAL WHITEPAPER**\n\nDeep dive into Mint & Burn logic, Smart Contract & Sustainability.`, { 
        parse_mode: 'Markdown', 
        ...Markup.inlineKeyboard([[Markup.button.url('📄 Read Whitepaper', CONFIG.whitepaper)], [Markup.button.callback('🔙 Back', 'SHOW_MENU')]]) 
    }).catch(() => {});
});

// 🛡 AUDIT
bot.action('AUDIT', (ctx) => {
    ctx.editMessageText(`🛡 **AUDIT REPORT**\n\n✅ 100% Secure\n✅ No Backdoors\n✅ Verified Contract`, { 
        parse_mode: 'Markdown', 
        ...Markup.inlineKeyboard([[Markup.button.url('🛡 View Audit', CONFIG.audit)], [Markup.button.callback('🔙 Back', 'SHOW_MENU')]]) 
    }).catch(() => {});
});

// 🗺 ROADMAP
bot.action('MAP', (ctx) => {
    ctx.editMessageText(`🗺 **ROADMAP**\n\n📍 Phase 1: Launch\n📍 Phase 2: Marketing\n📍 Phase 3: Expansion`, { 
        parse_mode: 'Markdown', 
        ...Markup.inlineKeyboard([[Markup.button.url('🗺 View Roadmap', CONFIG.roadmapPdf)], [Markup.button.callback('🔙 Back', 'SHOW_MENU')]]) 
    }).catch(() => {});
});

// ❓ FAQ
bot.action('FAQ', (ctx) => {
    ctx.editMessageText(`❓ **FAQs**\n\n**Q:** Min Investment?\n**A:** Just $1.\n\n**Q:** Is it safe?\n**A:** Yes, fully decentralized.`, { 
        parse_mode: 'Markdown', 
        ...Markup.inlineKeyboard([[Markup.button.url('❓ Read FAQs', CONFIG.faqPdf)], [Markup.button.callback('🔙 Back', 'SHOW_MENU')]]) 
    }).catch(() => {});
});


// --- 3. MEGA WELCOME (New Members) ---
bot.on('new_chat_members', async (ctx) => {
if (!ctx.message || !ctx.message.new_chat_members) return;
const newMembers = ctx.message.new_chat_members;
    for (const member of newMembers) {
        if (member.id === ctx.botInfo.id) continue;
        const name = member.first_name || 'Member';
        
        const welcomeText = `
🚀 **WELCOME, ${name}!**
━━━━━━━━━━━━━━━━━━━━━
Welcome to **Stallion Exchange** - The Future of Polygon Trading.

👇 **Start Your Journey Here:**`;
        
        const buttons = Markup.inlineKeyboard([
            [Markup.button.url('📝 Register Now', CONFIG.register), Markup.button.url('🎥 How to Buy', CONFIG.video)],
            [Markup.button.callback('📘 Open Main Menu', 'SHOW_MENU')]
        ]);

        try {
            await ctx.replyWithPhoto(CONFIG.logo, { caption: welcomeText, parse_mode: 'Markdown', ...buttons });
        } catch (e) {
            ctx.replyWithMarkdown(welcomeText, buttons);
        }
    }
});


// --- 4. PIN MESSAGE COMMAND ---
bot.command('pin_post', async (ctx) => {

    const pinText = `
🚀 *What can this bot do?*

🚀 *STALLION EXCHANGE* 🐴  
🌐 100% Decentralized Exchange  
💎 Life Changing Opportunity  

✔️ Buy = Price UP  
✔️ Sell = Price still UP  

💰 *Income Plan*  
👉 10% Direct  
👉 1% Level (10 Levels)  

🔥 Activate income with just $10  

🔄 *Smart Token System*  
Buy → Mint + 15% Liquidity  
Sell → Burn + 15% Liquidity  

📈 Liquidity + Burn = Price Growth  

✅ Transparent | Real Product | Long-term  

👉 Join today. Build your future with Stallion Exchange
`;


  const pinButtons = Markup.inlineKeyboard([
[
    Markup.button.url(
        '📝 Register Now', 
        `https://t.me/${ctx.botInfo.username}?start=register`
    )
],    [Markup.button.url('🌐 Website', CONFIG.website)],
    [
        Markup.button.url('📄 Whitepaper', CONFIG.whitepaper), 
        Markup.button.url('🛡 Audit Report', CONFIG.audit)
    ],
    [
        Markup.button.url('🗺 Roadmap', CONFIG.roadmapPdf)
    ],
    [
        Markup.button.url('🤖 Start Bot Menu', `https://t.me/${ctx.botInfo.username}?start=menu`)
    ]
]);


    try {

        const msg = await bot.telegram.sendPhoto(
            CONFIG.channel,
            { source: './banner.jpg' },   // 👈 image file
            {
                caption: pinText,
                parse_mode: 'Markdown',
                reply_markup: pinButtons.reply_markup
            }
        );

        try {
            await bot.telegram.pinChatMessage(CONFIG.channel, msg.message_id);
        } catch (e) {}

        ctx.reply("✅ Image + Message Channel mein bhej diya aur PIN bhi kar diya!");

    } catch (e) {
        console.log(e);
        ctx.reply(`❌ Error: ${e.message}`);
    }
});



// --- 5. AUTO-POSTING SYSTEM ---
const startAutoPosting = () => {
    const intervalMinutes = 30; // 30 Minute Loop
    
    const sendRandomMessage = async () => {
        const botUser = BOT_USERNAME;
        const AUTO_MESSAGES = [
            {
                text: `💎 **DID YOU KNOW?**\n\n**Stallion Exchange** has a unique mechanism!\n✅ **Buy** = Mint Token\n✅ **Sell** = Burn Token\n\n👇 **Start Trading:**`,
                buttons: Markup.inlineKeyboard([[Markup.button.url('💰 How to Buy', `https://t.me/${botUser}?start=buy`)]])
            },
            {
                text: `🚀 **JOIN THE REVOLUTION**\n\nMinimum Investment: **$1** only on Polygon Network!\n\n👇 **Join Now:**`,
                buttons: Markup.inlineKeyboard([[Markup.button.url(
   '🔗 Register',
   `https://t.me/${BOT_USERNAME}?start=register`
)]])
            }
        ];
        
        const randomItem = AUTO_MESSAGES[Math.floor(Math.random() * AUTO_MESSAGES.length)];

        try {
            await bot.telegram.sendMessage(CONFIG.channel, randomItem.text, { parse_mode: 'Markdown', ...randomItem.buttons });
            console.log("✅ Auto-Post sent.");
        } catch (error) { console.log("❌ Auto-Post FAILED:", error.message); }
    };

    setInterval(sendRandomMessage, intervalMinutes * 60 * 1000);
    sendRandomMessage(); 
};


// --- 6. LAUNCH ---
bot.launch().then(() => {
    BOT_USERNAME = bot.botInfo.username;
    console.log(`✅ Stallion Bot is Online! (@${BOT_USERNAME})`);
    startAutoPosting();
});

// Graceful Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));