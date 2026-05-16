const translations = {
  en: {
    eyebrow: 'Diaspora commerce, made simple',
    heroTitle: "The world's first<br/><em>diaspora commerce</em> network.",
    heroSub: 'Sariko connects Filipino home cooks with hungry neighbors in Ho Chi Minh City — and is building the platform for the 280 million people living away from home.',
    buyerTitle: 'Order homemade food',
    buyerDesc: 'Discover Filipino home cooks near you in HCMC. Browse menus, order, and get it delivered.',
    buyerCta: 'Open the app →',
    sellerTitle: 'Become a founding seller',
    sellerDesc: 'Join the first 50 Filipino sellers on Sariko. 3 months free, VIP badge, weekly payouts — no Vietnamese business registration required.',
    sellerCta: 'Apply to sell →',
    investorTitle: "Join the Founder's Circle",
    investorDesc: 'Invitation-only early investment. 15 backers, three tiers, 20% discount before VC. Own a piece of the diaspora network.',
    investorCta: 'See the offer →',
    footerTagline: 'Diaspora Commerce · Node 1: Ho Chi Minh City',
    footerNavBuyer: 'Order Food ↗',
    footerNavSeller: 'Sell on Sariko ↗',
    footerNavInvestor: 'Invest ↗',
    footerOperated: 'SariKo is operated by Zen Tech Asia Co., Ltd. under BridgeTech Labs, Inc.',
    footerRights: 'All rights reserved.',
  },
  vi: {
    eyebrow: 'Thương mại cộng đồng, đơn giản hoá',
    heroTitle: 'Mạng lưới <em>thương mại cộng đồng</em><br/>đầu tiên trên thế giới.',
    heroSub: 'Sariko kết nối những đầu bếp tại gia người Philippines với thực khách ở TP.HCM — và đang xây dựng nền tảng cho 280 triệu người đang sống xa quê hương.',
    buyerTitle: 'Đặt món ăn nhà làm',
    buyerDesc: 'Khám phá các đầu bếp tại gia người Philippines gần bạn ở TP.HCM. Xem menu, đặt món và nhận giao tận nơi.',
    buyerCta: 'Mở ứng dụng →',
    sellerTitle: 'Trở thành seller sáng lập',
    sellerDesc: 'Gia nhập 50 seller Philippines đầu tiên trên Sariko. 3 tháng miễn phí, huy hiệu VIP, thanh toán hàng tuần — không cần đăng ký kinh doanh tại Việt Nam.',
    sellerCta: 'Đăng ký bán hàng →',
    investorTitle: 'Tham gia Founder\'s Circle',
    investorDesc: 'Đầu tư sớm theo lời mời. 15 nhà đầu tư, ba bậc, giảm 20% trước vòng VC. Sở hữu một phần của mạng lưới diaspora.',
    investorCta: 'Xem ưu đãi →',
    footerTagline: 'Thương mại Cộng đồng · Node 1: TP. Hồ Chí Minh',
    footerNavBuyer: 'Đặt món ↗',
    footerNavSeller: 'Bán trên Sariko ↗',
    footerNavInvestor: 'Đầu tư ↗',
    footerOperated: 'SariKo được vận hành bởi Zen Tech Asia Co., Ltd. thuộc BridgeTech Labs, Inc.',
    footerRights: 'Bảo lưu mọi quyền.',
  },
  tl: {
    eyebrow: 'Diaspora commerce, pinadali',
    heroTitle: 'Ang unang <em>diaspora commerce</em><br/>network sa mundo.',
    heroSub: 'Pinagdudugtong ng Sariko ang Pilipinong home cooks at gutom na kapitbahay sa Ho Chi Minh City — at binubuo ang platform para sa 280 milyong Pilipinong nasa ibang bansa.',
    buyerTitle: 'Mag-order ng homemade food',
    buyerDesc: 'Tuklasin ang Pilipinong home cooks malapit sa iyo sa HCMC. Tingnan ang menu, mag-order, at pa-deliver.',
    buyerCta: 'Buksan ang app →',
    sellerTitle: 'Maging founding seller',
    sellerDesc: 'Sumali sa unang 50 Pilipinong sellers sa Sariko. 3 buwang libre, VIP badge, lingguhang payout — hindi kailangan ng Vietnamese business registration.',
    sellerCta: 'Mag-apply na magbenta →',
    investorTitle: "Sumali sa Founder's Circle",
    investorDesc: 'Invitation-only na early investment. 15 backers, tatlong tier, 20% discount bago ang VC. Magkaroon ng bahagi sa diaspora network.',
    investorCta: 'Tingnan ang offer →',
    footerTagline: 'Diaspora Commerce · Node 1: Ho Chi Minh City',
    footerNavBuyer: 'Mag-order ↗',
    footerNavSeller: 'Magbenta sa Sariko ↗',
    footerNavInvestor: 'Mamuhunan ↗',
    footerOperated: 'Ang SariKo ay pinapatakbo ng Zen Tech Asia Co., Ltd. sa ilalim ng BridgeTech Labs, Inc.',
    footerRights: 'Lahat ng karapatan ay nakalaan.',
  },
};

const STORAGE_KEY = 'sariko_lang';
const SUPPORTED = ['en', 'vi', 'tl'];

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });
}

function detectInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;

  const browser = (navigator.language || 'en').toLowerCase();
  if (browser.startsWith('vi')) return 'vi';
  if (browser.startsWith('tl') || browser.startsWith('fil')) return 'tl';
  return 'en';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  applyLanguage(detectInitialLanguage());

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      localStorage.setItem(STORAGE_KEY, lang);
      applyLanguage(lang);
    });
  });
});
