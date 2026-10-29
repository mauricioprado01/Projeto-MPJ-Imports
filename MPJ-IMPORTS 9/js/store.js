/* MPJ IMPORTS: demonstração local, sem pagamentos nem contas reais. */
(() => {
  'use strict';
  const BASE = window.MPJ_PRODUCTS || [];
  const KEY = 'mpj_store_v3_catalog36';
  const defaults = {cart:[], favorites:[], recently:[], compare:[]};
  const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const html = s=>String(s??'').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const tidy = s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const brl = n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)||0);
  const params = new URLSearchParams(location.search);
  const pageName = document.body.dataset.page || 'home';
  let saved;
  try {saved = {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}} catch {saved = structuredClone(defaults)}
  
  if(!Array.isArray(saved.cart))saved.cart=[];
  if(!Array.isArray(saved.favorites))saved.favorites=[];
  if(!Array.isArray(saved.compare))saved.compare=[];
  if(!Array.isArray(saved.recently))saved.recently=[];
  
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify({cart:saved.cart,favorites:saved.favorites,recently:saved.recently,compare:saved.compare}));return true}catch{return false}};
  // LocalStorage é restrito a este navegador e dispositivo. Não existe sincronização.
  const products=()=>BASE;
  const getProduct=id=>products().find(p=>p.id===id);
  const image=p=>p.image||`assets/products/${encodeURIComponent(p.id)}.webp`;
  const productImages=p=>[image(p),...(Array.isArray(p.images)?p.images.filter(v=>typeof v==='string'&&v!==image(p)):[])];
  const sizesOf=p=>Array.isArray(p.sizes)?p.sizes.filter(s=>typeof s==='string'&&s.trim()):[];
  const modelsOf=p=>Array.isArray(p.models)?p.models.filter(x=>typeof x==='string'&&x.trim()):[];
  const tagline=p=>`Camisa ${p.kit||'Titular'} ${p.club}${p.edition?` — ${p.edition}`:''} — ${p.season||'Coleção'}`;
  const range=p=>p.region==='Brasil'?'Brasileiros':'Internacionais';
  const OFF=p=>0; // Não exibir descontos sem ofertas verificadas.
  const filtered=(fn)=>products().filter(fn);
  const icon=(id,n=21)=>{const paths={search:'<circle cx="11" cy="11" r="7"/><path d="m16.2 16.2 4.6 4.6"/>',cart:'<path d="M3 4h2l2.1 11.5h11.8l2-8.2H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',bag:'<path d="M4 8h16l-1.5 13h-13L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',heart:'<path d="M20.5 8a4.5 4.5 0 0 0-8.5-1.9A4.5 4.5 0 0 0 3.5 8c0 5.4 8.5 11 8.5 11s8.5-5.6 8.5-11Z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21c1.5-7 13.5-7 15 0"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',close:'<path d="M5 5 19 19M19 5 5 19"/>',arrow:'<path d="M3 12h18m-7-7 7 7-7 7"/>',chevron:'<path d="m7 10 5 5 5-5"/>',check:'<path d="m4 12 5 5L20 6"/>',trash:'<path d="M4 7h16M10 4h4m-7 3 1 14h8l1-14M10 11v6m4-6v6"/>',plus:'<path d="M12 4v16M4 12h16"/>',minus:'<path d="M4 12h16"/>',filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',sliders:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="17" r="2" fill="currentColor"/>',truck:'<path d="M2 7h12v11H2zM14 10h4l4 4v4h-8"/><circle cx="6.5" cy="19" r="2"/><circle cx="18.5" cy="19" r="2"/>',shield:'<path d="M12 2 21 6v6c0 5-3 8-9 10-6-2-9-5-9-10V6z"/><path d="m8 12 3 3 5-6"/>',swap:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 17v4h16v-4"/>',download:'<path d="M12 3v13m-5-5 5 5 5-5M4 18v3h16v-3"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',eye:'<path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7S5 17 2 12Z"/><circle cx="12" cy="12" r="3"/>',spark:'<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z"/>',percent:'<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M4 20 20 4"/>',mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/>'};return `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id]||paths.spark}</svg>`};
  function topbar(){
    const currentCount=products().length;
    return `<div class="microbar"><div class="wrap microbar-inner"><span><span class="status-dot"></span> FUTEBOL, ESTILO E IDENTIDADE</span><span>COLEÇÃO AUTÊNTICA DE FOTOS ENVIADAS &nbsp; • &nbsp; LOJA DEMONSTRATIVA</span><span>MPJ IMPORTS®</span></div></div>
    <header class="site-header">
      <div class="wrap head-main">
        <button class="mobile-toggle icon-btn" aria-label="Abrir menu" data-action="mobile-menu">${icon('menu',23)}</button>
        <a class="brand" href="index.html" aria-label="MPJ Imports — Início"><img src="assets/brand/logo.webp" alt="Emblema MPJ IMPORTS" width="68" height="68"><span><b>MPJ</b><small>IMPORTS</small></span></a>
        <form class="head-search" id="head-search-form" role="search" autocomplete="off"><label class="search-mark" for="global-search">${icon('search',22)}</label><input id="global-search" name="q" placeholder="Encontre a camisa do seu time" aria-label="Pesquisar camisas" value="${pageName==='catalog'?html(params.get('q')||''):''}"><button type="submit" class="search-submit" aria-label="Pesquisar">BUSCAR ${icon('arrow',15)}</button><div class="search-suggestions" id="suggestions"></div></form>
        <div class="head-right"><a class="head-action head-favorite" href="favoritos.html" aria-label="Ver favoritos">${icon('heart',23)}<span class="head-label">Favoritos</span><em id="fav-count">0</em></a><button class="head-action head-cart" data-action="open-cart" aria-label="Abrir carrinho">${icon('bag',24)}<span class="head-label">Meu carrinho</span><em id="bag-count">0</em></button></div>
      </div>
      <div class="navband"><div class="wrap navband-inner"><button class="department-button" data-action="departments" aria-expanded="false">${icon('menu',19)} Explorar departamentos ${icon('chevron',15)}</button><nav class="primary-nav" aria-label="Categorias principais"><a href="index.html">INÍCIO</a><a href="produtos.html?region=Brasil">BRASILEIRÃO</a><a href="produtos.html?region=Europa">EUROPA</a><a href="produtos.html?region=Sele%C3%A7%C3%B5es">SELEÇÕES</a><a href="produtos.html?region=Am%C3%A9rica%20do%20Norte">MUNDO</a><a href="produtos.html?kit=Retr%C3%B4">RETRÔ</a><a href="produtos.html">COLEÇÃO</a></nav><a class="nav-promo" href="produtos.html">EXPLORE ${currentCount} CAMISAS ${icon('arrow',17)}</a></div>
        <div class="department-menu" id="department-menu"><div class="wrap menu-layout"><div><strong>FUTEBOL BRASILEIRO</strong><a href="produtos.html?region=Brasil">Ver todos os times brasileiros</a>${[...new Set(filtered(p=>p.region==='Brasil').map(p=>p.club))].slice(0,11).map(n=>`<a href="produtos.html?q=${encodeURIComponent(n)}">${html(n)}</a>`).join('')}</div><div><strong>FUTEBOL MUNDIAL</strong><a href="produtos.html?region=Europa">Todos da Europa</a>${[...new Set(filtered(p=>p.region==='Europa').map(p=>p.club))].slice(0,9).map(n=>`<a href="produtos.html?q=${encodeURIComponent(n)}">${html(n)}</a>`).join('')}<a href="produtos.html?region=Sele%C3%A7%C3%B5es">Ver seleções</a><a href="produtos.html?kit=Retr%C3%B4">Camisas retrô</a></div><div class="menu-highlight"><span>UMA LOJA. MIL HISTÓRIAS.</span><h3>A PRÓXIMA<br>CAMISA É SUA.</h3><p>Do clube de infância às seleções do mundo: explore a coleção MPJ.</p><a href="produtos.html" class="menu-highlight-link">EXPLORAR TUDO ${icon('arrow',17)}</a></div></div></div>
      </div>
      <div class="mobile-menu" id="mobile-menu"><a href="index.html">Início</a><a href="produtos.html">Todas as camisas</a><a href="produtos.html?region=Brasil">Times brasileiros</a><a href="produtos.html?region=Europa">Times europeus</a><a href="produtos.html?region=Sele%C3%A7%C3%B5es">Seleções</a><a href="produtos.html">Coleção completa</a><a href="produtos.html?kit=Retr%C3%B4">Coleção retrô</a><a href="favoritos.html">Meus favoritos</a></div>
    </header>
    <div class="benefit-strip"><div class="wrap benefit-grid"><span>${icon('shield',17)} FOTOGRAFIAS ORIGINAIS ENVIADAS</span><span>${icon('heart',17)} FAVORITOS PARA GUARDAR</span><span>${icon('truck',18)} FRETE A CONSULTAR</span><span>${icon('spark',17)} SEMPRE MAIS CAMISAS</span></div></div>`;
  }
  function foot(){return `<footer class="site-footer"><div class="wrap footer-top"><section><div class="footer-logo"><img src="assets/brand/logo.webp" alt="Logo MPJ IMPORTS" width="70" height="70"><div><b>MPJ IMPORTS</b><small>FUTEBOL EM CADA DETALHE.</small></div></div><p>Do Brasil à Europa. Camisas escolhidas para quem leva a paixão por futebol a sério.</p></section><section><h4>LOJA</h4><a href="produtos.html">Todos os produtos</a><a href="produtos.html?region=Brasil">Clubes do Brasil</a><a href="produtos.html?region=Europa">Clubes da Europa</a><a href="produtos.html?kit=Retr%C3%B4">Coleção retrô</a><a href="favoritos.html">Meus favoritos</a></section><section><h4>ATENDIMENTO</h4><a href="carrinho.html">Meu carrinho</a><a href="index.html#sobre">Sobre a MPJ</a></section><section class="footer-news"><h4>FAÇA PARTE DA TORCIDA</h4><p>Este projeto é uma demonstração de e-commerce. Newsletter e pagamentos reais ainda não estão ativos.</p><span class="footer-tag">MPJ / FOOTBALL CULTURE</span></section></div><div class="wrap footer-bottom"><span>© 2026 MPJ IMPORTS. Projeto demonstrativo.</span><span>Fotografias fornecidas pelo usuário • Preços ilustrativos</span></div></footer>`}
  const shell=content=>{ $('#app').innerHTML=topbar()+`<main id="main">${content}</main>`+(pageName==='home'||pageName==='product'?recentBlock():'')+foot()+`<div class="dim" id="drawer-dim" data-action="close-cart"></div><aside class="cart-drawer" id="cart-drawer" aria-hidden="true"></aside><div class="toast" id="toast" role="status" aria-live="polite"></div><dialog id="size-modal" class="size-modal"></dialog><dialog id="zoom-modal" class="zoom-modal"></dialog><dialog id="quick-modal" class="xp-modal"></dialog><dialog id="compare-modal" class="xp-modal xp-compare-dialog"></dialog><div id="compare-tray" class="xp-compare-tray" aria-live="polite"></div><button class="back-top" data-action="back-top" aria-label="Voltar ao topo">↑</button>`; updateCounts();renderCompareTray() };
  const badges=()=>({cart:saved.cart.reduce((a,x)=>a+Number(x.qty||0),0),fav:saved.favorites.length});
  function updateCounts(){const n=badges();if($('#bag-count'))$('#bag-count').textContent=n.cart;if($('#fav-count'))$('#fav-count').textContent=n.fav}
  function notice(s){const el=$('#toast');if(!el)return;el.textContent=s;el.classList.add('shown');clearTimeout(notice.t);notice.t=setTimeout(()=>el.classList.remove('shown'),2900)}
  const imageBlock=(p,cl='',priority=false)=>`<img class="${cl}" src="${html(image(p))}" alt="Fotografia enviada: camisa do ${html(p.club)}" loading="${priority?'eager':'lazy'}" decoding="async" ${priority?'fetchpriority="high"':''}>`;
  function card(p){
    const fav=saved.favorites.includes(p.id), compared=saved.compare.includes(p.id),imgs=productImages(p);
    const title=`${p.club} — ${p.edition||'Camisa '+(p.kit||'Titular')}`;
    return `<article class="item-card xp-card" data-region="${html(p.region)}" data-product="${html(p.id)}">
      <div class="item-frame"><a href="produto.html?id=${encodeURIComponent(p.id)}" class="item-photo" aria-label="Ver ${html(title)}">
        ${imageBlock(p)}${imgs.length>1?`<img class="xp-hover-photo" src="${html(imgs[1])}" alt="Outro ângulo real de ${html(p.club)}" loading="lazy">`:''}</a>
        <div class="card-topline"><span class="xp-photo-tag">FOTO REAL</span><button class="heart-toggle ${fav?'selected':''}" data-action="favorite" data-id="${html(p.id)}" aria-label="${fav?'Remover dos':'Adicionar aos'} favoritos" aria-pressed="${fav}">${icon('heart',20)}</button></div>
        <div class="xp-card-actions"><button type="button" data-action="quick-view" data-id="${html(p.id)}" aria-label="Visualização rápida de ${html(p.club)}">${icon('eye',17)} Ver detalhes</button><button type="button" data-action="compare-toggle" data-id="${html(p.id)}" class="${compared?'active':''}" aria-pressed="${compared}" aria-label="${compared?'Remover da':'Adicionar à'} comparação">${icon('swap',16)} Comparar</button></div>
      </div><div class="item-details"><div class="item-kicker">${html(p.region)} · ${html(p.kit||'Camisa')} · ${html(p.season||'Atual')}</div><a href="produto.html?id=${encodeURIComponent(p.id)}" class="item-title">${html(title)}</a><span class="item-categ">${html(p.tag||'Acervo MPJ IMPORTS')}</span><div class="item-prices"><strong>${brl(p.price)}</strong></div><div class="installments">Preço de referência do projeto · sem frete</div></div></article>`;
  }
  const heading=(k,t,desc='',href='produtos.html')=>`<div class="section-title"><div><span class="overline">${k}</span><h2>${t}</h2>${desc?`<p>${desc}</p>`:''}</div><a href="${href}">VER COLEÇÃO ${icon('arrow',16)}</a></div>`;
  let activeHero=0, featuredCategory='Todos', finderRegion='Todos', finderStyle='Todos';
  const heroes=[
    {id:'real-madrid-floral',series:'001 / THE CULTURE ISSUE',label:'A CULTURA NÃO SAI DE CAMPO',title:'Estilo<br><i>em cada</i><br><em>jogada.</em>',desc:'Do gramado para as ruas. Uma coleção feita para quem carrega o jogo na própria identidade.',link:'produtos.html',cta:'ENCONTRE SEU MANTO',short:'REAL MADRID / CULTURE',theme:'floral'},
    {id:'argentina-azul-treino',series:'002 / WORLDWIDE',label:'TODAS AS BANDEIRAS. UMA PAIXÃO.',title:'Todas as<br><i>cores.</i><br><em>Uma paixão.</em>',desc:'As cores das seleções, a energia das torcidas e a história por trás de cada camisa.',link:'produtos.html?region=Sele%C3%A7%C3%B5es',cta:'DESCUBRA AS SELEÇÕES',short:'ARGENTINA / WORLDWIDE',theme:'world'},
    {id:'liverpool-verde',series:'003 / OFF THE PITCH',label:'DO ESTÁDIO PARA A CIDADE',title:'Seu time.<br><i>Seu jeito.</i><br><em>Sua história.</em>',desc:'O futebol ocupa as ruas. Escolha peças que vão muito além dos noventa minutos.',link:'produtos.html?region=Europa',cta:'EXPLORAR EUROPA',short:'LIVERPOOL / STREET',theme:'street'}
  ];
  function heroSlide(){const h=heroes[activeHero],p=getProduct(h.id);return `<div class="neo-hero neo-${h.theme}" aria-label="Campanha ${activeHero+1}"><div class="neo-hero-copy"><div class="neo-hero-top"><span class="neo-dot"></span><span>MPJ IMPORTS <b>/</b> FOOTBALL CULTURE</span><span>${h.series}</span></div><span class="neo-hero-tag">${h.label}</span><h1>${h.title}</h1><p>${h.desc}</p><div class="neo-hero-actions"><a class="neo-primary" href="${h.link}">${h.cta} ${icon('arrow',21)}</a><a href="produtos.html?region=Brasil" class="neo-ghost">CLUBES DO BRASIL ${icon('arrow',17)}</a></div><div class="neo-hero-bottom"><span>${products().length} PEÇAS. HISTÓRIAS INFINITAS.</span><span>SCROLL PARA DESCOBRIR ↓</span></div></div><div class="neo-hero-visual"><div class="neo-hero-acid"><div class="neo-huge" aria-hidden="true">MPJ</div></div>${p?imageBlock(p,'neo-model',true):''}<div class="neo-image-label"><span>ON BODY / REAL PHOTO</span><strong>${h.short}</strong><a href="produto.html?id=${encodeURIComponent(h.id)}" aria-label="Ver ${html(p?.club||'produto')}">${icon('arrow',20)}</a></div><span class="neo-vertical" aria-hidden="true">THERE IS NO OFF-SEASON</span></div></div>`}
  function heroControl(){return `<div class="neo-hero-controls"><div class="neo-progress">${heroes.map((h,i)=>`<button class="${i===activeHero?'active':''}" data-action="hero-dot" data-slide="${i}" aria-label="Ver campanha ${i+1}" aria-pressed="${i===activeHero}"><span>0${i+1}</span><i></i></button>`).join('')}</div><div class="neo-hero-arrows"><button data-action="hero-prev" aria-label="Campanha anterior">←</button><button data-action="hero-next" aria-label="Próxima campanha">→</button></div></div>`}
  function renderHero(){const el=$('#ultra-hero-content');if(el)el.innerHTML=heroSlide();const ctrl=$('#ultra-hero-controls');if(ctrl)ctrl.innerHTML=heroControl()}
  function featuredProducts(){let list=products();if(featuredCategory!=='Todos')list=list.filter(p=>p.region===featuredCategory);else list=['real-madrid-floral','palmeiras','liverpool-verde','flamengo','barcelona','argentina-azul-treino','guarani-branca','juventus'].map(getProduct).filter(Boolean);return list.slice(0,8)}
  function drawFeatured(){const el=$('#featured-product-grid');if(el)el.innerHTML=featuredProducts().map(card).join('');$$('[data-action="feature-tab"]').forEach(b=>{const on=b.dataset.category===featuredCategory;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))})}
  function finderResults(){let a=products().filter(p=>(finderRegion==='Todos'||p.region===finderRegion)&&(finderStyle==='Todos'||p.kit===finderStyle));if(!a.length)a=products().filter(p=>finderRegion==='Todos'||p.region===finderRegion);return a.slice(0,3)}
  function drawFinder(){const el=$('#neo-finder-result');if(el)el.innerHTML=finderResults().map(p=>`<a class="neo-finder-card" href="produto.html?id=${encodeURIComponent(p.id)}"><span class="neo-finder-photo">${imageBlock(p)}</span><span class="neo-finder-name"><small>${html(p.kit)} · ${html(p.region)}</small><strong>${html(p.club)}</strong><b>${brl(p.price)}</b></span>${icon('arrow',17)}</a>`).join('');$$('[data-action="finder-region"]').forEach(b=>{let on=b.dataset.value===finderRegion;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});$$('[data-action="finder-style"]').forEach(b=>{let on=b.dataset.value===finderStyle;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
  let flagshipActive=0;
  const flagshipSlides=[
    {layout:'collab',tag:'NOVA COLLAB ESPECIAL',eyebrow:'MPJ SPECIAL CURATION',title:'Barcelona x Golf Wang',desc:'Uma collab em destaque com estética própria e fotos em tela cheia. Passe o mouse sobre cada imagem para destacar a campanha.',cta:'Explorar collab',link:'produtos.html?q=Barcelona',tone:'neutral',index:'01',hint:'COLLAB / BARCELONA',images:[
      {src:'assets/collab/barca-collab-1.png',label:'Campanha 01'},
      {src:'assets/collab/barca-collab-2.png',label:'Campanha 02'},
      {src:'assets/collab/barca-collab-3.png',label:'Campanha 03'},
      {src:'assets/collab/barca-collab-4.png',label:'Campanha 04'}
    ]},
    {id:'argentina-azul-treino',tag:'SELEÇÕES EM DESTAQUE',eyebrow:'THE GLOBAL FOOTBALL CLUB',title:'O mundo joga.<br><em>Você escolhe.</em>',desc:'Seleções, tradições e histórias em uma seleção de peças feita por quem respira futebol.',cta:'Ver seleções',link:'produtos.html?region=Sele%C3%A7%C3%B5es',tone:'neutral',index:'02',hint:'ARGENTINA / TRAINING'},
    {id:'inter-miami-branca',tag:'ALÉM DAS QUATRO LINHAS',eyebrow:'EDITORIAL MPJ IMPORTS',title:'Vista o jogo.<br><em>Viva a cultura.</em>',desc:'Camisas para o campo, para a cidade e para todas as maneiras de demonstrar sua identidade.',cta:'Ver futebol mundial',link:'produtos.html?region=Am%C3%A9rica%20do%20Norte',tone:'neutral',index:'03',hint:'INTER MIAMI / STREET'}
  ];
  function flagshipHero(){let h=flagshipSlides[flagshipActive],p=h.id?getProduct(h.id):null;if(h.layout==='collab'){const featured=h.images[0];return `<div class="flag-hero-stage flag-collab-stage tone-${h.tone}" id="flag-hero-stage"><div class="flag-collab-focus"><div class="flag-collab-main"><img id="flag-collab-main-image" src="${featured.src}" alt="${featured.label}"><span class="flag-collab-badge">${h.tag}</span><span class="flag-hero-bignum">${h.index}</span></div><div class="flag-collab-panel"><span class="flag-hero-eyebrow"><i></i> ${h.eyebrow}</span><div class="flag-collab-kicker">${h.tag}</div><h1>${h.title}</h1><p>${h.desc}</p><div class="flag-hero-buttons"><a class="flag-primary-cta" href="${h.link}">${h.cta} ${icon('arrow',19)}</a><a class="flag-outline-cta" href="produtos.html?region=Europa">Ver futebol europeu ${icon('arrow',18)}</a></div><div class="flag-collab-thumbs">${h.images.map((img,i)=>`<button type="button" class="flag-collab-thumb ${i===0?'active':''}" data-action="collab-hover" data-src="${img.src}" data-label="${img.label}" aria-label="Destacar ${img.label}"><img src="${img.src}" alt="${img.label}"><span>${img.label}</span></button>`).join('')}</div><div class="flag-hero-stats"><span><strong>1</strong> jogador em destaque</span><span><strong>${h.images.length}</strong> fotos especiais</span></div></div></div></div>`}return `<div class="flag-hero-stage tone-${h.tone}" id="flag-hero-stage"><div class="flag-hero-copy"><span class="flag-hero-eyebrow"><i></i> ${h.eyebrow}</span><h1>${h.title}</h1><p>${h.desc}</p><div class="flag-hero-buttons"><a class="flag-primary-cta" href="${h.link}">${h.cta} ${icon('arrow',19)}</a><a class="flag-outline-cta" href="produtos.html?region=Brasil">Ver clubes brasileiros ${icon('arrow',18)}</a></div><div class="flag-hero-stats"><span><strong>${products().length}</strong> modelos no catálogo</span><span><strong>100%</strong> fotos enviadas</span></div></div><div class="flag-hero-visual">${p?imageBlock(p,'flag-hero-photo',true):''}<span class="flag-hero-bignum">${h.index}</span><a class="flag-hero-product" href="produto.html?id=${encodeURIComponent(h.id)}"><span class="flag-mini-dot"></span><span>${h.hint}<b>Conhecer produto ${icon('arrow',15)}</b></span></a></div><span class="flag-hero-corner">${h.tag}</span></div>`}
  function flagDots(){return `<div class="flag-carousel-bottom"><div class="flag-pagination" role="group" aria-label="Escolher campanha">${flagshipSlides.map((h,i)=>`<button class="${flagshipActive===i?'active':''}" data-action="flag-slide" data-slide="${i}" aria-label="Ver campanha ${i+1}" aria-pressed="${flagshipActive===i}"><span>0${i+1}</span><i></i></button>`).join('')}</div><div class="flag-hero-arrows"><button data-action="flag-prev" aria-label="Campanha anterior">${icon('arrow',19)}</button><button data-action="flag-next" aria-label="Próxima campanha">${icon('arrow',19)}</button></div></div>`}
  function renderFlagship(){const stage=$('#flag-stage'),dots=$('#flag-controls');if(stage)stage.innerHTML=flagshipHero();if(dots)dots.innerHTML=flagDots()}
  function updateCollabHero(src,label,thumb){const img=$('#flag-collab-main-image');if(img&&src){img.src=src;img.alt=label||'Collab especial'}$$('.flag-collab-thumb').forEach(x=>x.classList.toggle('active',x===thumb))}
  const flagShowcase=(id)=>{const p=getProduct(id);return p?imageBlock(p):''};
  const flagLink=(p)=>`produto.html?id=${encodeURIComponent(p.id)}`;
  const flagCardStrip=(arr,count=5)=>arr.slice(0,count).map(card).join('');
  function flagSectionHeader(eyebrow,title,desc='',url='produtos.html') {return `<div class="flag-section-head"><div><span class="flag-eyebrow">${eyebrow}</span><h2>${title}</h2>${desc?`<p>${desc}</p>`:''}</div><a class="flag-text-link" href="${url}">Ver tudo ${icon('arrow',17)}</a></div>`}
  function flagRail(productsList,id){return `<div class="flag-product-rail" id="${id}">${flagCardStrip(productsList,8)}</div>`}
  function flagRenderFeatured(){const el=$('#flag-highlights-rail');if(el){const arr=featuredCategory==='Todos'?['palmeiras','flamengo','real-madrid','barcelona','corinthians','bayern','guarani-branca','argentina-azul-treino'].map(getProduct).filter(Boolean):products().filter(p=>p.region===featuredCategory);el.innerHTML=flagCardStrip(arr,8)}$$('[data-action="flag-tab"]').forEach(b=>{const on=b.dataset.category===featuredCategory;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))})}
  function home(){
    const all=products(),find=id=>getProduct(id),br=all.filter(p=>p.region==='Brasil'),eu=all.filter(p=>p.region==='Europa'),sel=all.filter(p=>p.region==='Seleções');
    const main=['palmeiras-verde-gola-v','palmeiras-amarela-sportingbet','palmeiras-branca-tricolor','palmeiras-110-anos-crefisa','palmeiras','flamengo','real-madrid','barcelona'].map(find).filter(Boolean);
    const brCards=['palmeiras','flamengo','corinthians','sao-paulo','cruzeiro','gremio','atletico-mg','mirassol'].map(find).filter(Boolean);
    const euCards=['real-madrid','barcelona','manchester-united','liverpool','bayern','psg','juventus','manchester-city'].map(find).filter(Boolean);
    const selCards=['argentina-azul-treino','espanha-creme','alemanha-azul-treino','italia-azul-claro','espanha-vermelha-retro'].map(find).filter(Boolean);
    const smallcats=[
      {name:'Brasileirão',desc:'O futebol é daqui',id:'flamengo',url:'produtos.html?region=Brasil',num:'01'},
      {name:'Europa',desc:'Os gigantes do mundo',id:'real-madrid',url:'produtos.html?region=Europa',num:'02'},
      {name:'Seleções',desc:'Orgulho sem fronteiras',id:'argentina-azul-treino',url:'produtos.html?region=Sele%C3%A7%C3%B5es',num:'03'},
      {name:'Lifestyle',desc:'Além do estádio',id:'real-madrid-floral',url:'produtos.html?kit=Especial',num:'04'}
    ];
    const catphotos=['palmeiras','corinthians','flamengo','real-madrid','barcelona','liverpool','argentina-azul-treino','atletico-mg'].map(find).filter(Boolean);
    const brandLabels=['adidas','Nike','PUMA','New Balance','Kappa','Umbro'];
    shell(`<div class="flag-home">
      <div class="wrap flag-breadcrumb"><span>MPJ IMPORTS</span><span class="flag-delimiter"></span> O futebol veste histórias <span class="flag-breadcrumb-right">EST. 2026 · BRASIL</span></div>
      <section class="flag-hero-wrap wrap" aria-label="Campanhas em destaque"><div id="flag-stage">${flagshipHero()}</div><div id="flag-controls">${flagDots()}</div></section>
      <section class="wrap flag-mini-features" aria-label="Benefícios da experiência MPJ"><div>${icon('shield',24)}<span><b>Fotos de verdade</b><small>Imagens dos produtos enviadas</small></span></div><div>${icon('heart',24)}<span><b>Sua coleção favorita</b><small>Salve os mantos que ama</small></span></div><div>${icon('bag',24)}<span><b>Experimente comprar</b><small>Checkout demonstrativo</small></span></div><div>${icon('spark',24)}<span><b>Sempre novas peças</b><small>Acervo em expansão</small></span></div></section>
      <section class="wrap flag-section flag-categories-section">${flagSectionHeader('EXPLORE POR CATEGORIA','Seu próximo manto começa aqui.','Quatro maneiras de encontrar a camisa que combina com você.')}<div class="flag-category-grid">${smallcats.map((c,i)=>`<a class="flag-category flag-category-${i+1}" href="${c.url}"><div class="flag-category-copy"><span>${c.num} / COLEÇÕES MPJ</span><h3>${c.name}</h3><p>${c.desc}</p><b>Explorar categoria ${icon('arrow',16)}</b></div>${flagShowcase(c.id)}</a>`).join('')}</div></section>
      <div class="flag-blue-ticker"><div class="wrap"><span>FUTEBOL + ESTILO + CULTURA</span><b>VISTA O QUE TE MOVE.</b><a href="produtos.html">DESCUBRA NOSSA COLEÇÃO ${icon('arrow',17)}</a></div></div>
      <section class="wrap flag-section flag-highlights-section">${flagSectionHeader('ESCOLHAS DA MPJ','Mais do que uma camisa.','Uma seleção de peças com fotos reais, cadastradas e prontas para explorar.')}<div class="flag-tabs"><div class="flag-tab-list">${['Todos','Brasil','Europa','Seleções'].map(k=>`<button data-action="flag-tab" data-category="${k}" class="${featuredCategory===k?'active':''}" aria-pressed="${featuredCategory===k}">${k==='Todos'?'Destaques':k}</button>`).join('')}</div><div class="flag-tab-arrows"><button data-action="flag-rail-left" aria-label="Ver produtos anteriores">${icon('arrow',20)}</button><button data-action="flag-rail-right" aria-label="Ver próximos produtos">${icon('arrow',20)}</button></div></div><div id="flag-highlights-rail" class="flag-product-rail">${flagCardStrip(main,8)}</div><div class="flag-more-row"><a href="produtos.html" class="flag-pill-btn">Explorar todas as ${all.length} camisas ${icon('arrow',17)}</a></div></section>
      <section class="wrap flag-section flag-retro-section">${flagSectionHeader('MPJ ARCHIVE / COLEÇÃO RETRÔ','A história também veste camisa.','Uniformes clássicos de clubes e seleções, com fotos reais enviadas para o acervo.','produtos.html?kit=Retr%C3%B4')}<div class="flag-product-rail">${flagCardStrip(['palmeiras-parmalat-retro','manchester-united-sharp-preta','milan-bwin-rubro-negra-retro','barcelona-centenario-1999','fiorentina-nintendo-retro','psg-opel-retro','brasil-umbro-amarela-retro','palmeiras-pirelli-retro'].map(getProduct).filter(Boolean),8)}</div><div class="flag-more-row"><a href="produtos.html?kit=Retr%C3%B4" class="flag-pill-btn">Ver todas as camisas retrô ${icon('arrow',17)}</a></div></section>
      <section class="wrap flag-collection-duo" aria-label="Coleções especiais"><a class="flag-collection-banner flag-collection-br" href="produtos.html?region=Brasil"><div class="flag-collection-content"><span>COLEÇÃO / 01</span><h2>O Brasil<br>entra em campo.</h2><p>Dos clássicos aos novos protagonistas.</p><b>Ver times do Brasil ${icon('arrow',18)}</b></div>${flagShowcase('palmeiras')}</a><a class="flag-collection-banner flag-collection-eu" href="produtos.html?region=Europa"><div class="flag-collection-content"><span>COLEÇÃO / 02</span><h2>O jogo não<br>tem fronteiras.</h2><p>Clubes que carregam o mundo nas cores.</p><b>Descobrir Europa ${icon('arrow',18)}</b></div>${flagShowcase('real-madrid-floral')}</a></section>
      <section class="flag-soft-section"><div class="wrap flag-section flag-camisas-br">${flagSectionHeader('PAIXÃO NACIONAL','A arquibancada é nossa.','Seu time, sua camisa, sua maneira de torcer.','produtos.html?region=Brasil')}<div class="flag-product-rail flag-light-rail">${flagCardStrip(brCards,8)}</div></div></section>
      <section class="wrap flag-section flag-clubs"><div class="flag-section-head"><div><span class="flag-eyebrow">EXPLORE O MUNDO</span><h2>Escolha pelo escudo.</h2><p>Uma galeria para encontrar sua próxima paixão.</p></div><a class="flag-text-link" href="produtos.html">Todos os clubes ${icon('arrow',17)}</a></div><div class="flag-club-carousel">${catphotos.map((p,i)=>`<a href="produtos.html?q=${encodeURIComponent(p.club)}" class="flag-club-tile"><div>${imageBlock(p)}</div><span>${html(p.club)}</span><small>${html(p.region)} ${icon('arrow',14)}</small></a>`).join('')}</div></section>
      <section class="flag-big-editorial"><div class="wrap flag-editorial-layout"><a href="produto.html?id=guarani-branca" class="flag-editorial-photo">${flagShowcase('guarani-branca')}<small>MPJ EDITORIAL / 2026</small></a><div class="flag-editorial-copy"><span class="flag-tag-light">CULTURA DE ARQUIBANCADA</span><h2>Camisas que<br>fazem <em>parte da<br>história.</em></h2><p>Tem camisa que a gente não veste. A gente vive. Do primeiro jogo no estádio aos domingos com a família, cada uniforme carrega algo único.</p><a href="produtos.html" class="flag-primary-cta flag-editorial-cta">Encontre a sua ${icon('arrow',18)}</a><div class="flag-editorial-number">${products().length}<span>peças no acervo inicial</span></div></div></div></section>
      <section class="wrap flag-section flag-eu-products">${flagSectionHeader('COLEÇÕES INTERNACIONAIS','Gigantes do outro lado do oceano.','Os símbolos que fazem o futebol global.','produtos.html?region=Europa')}<div class="flag-product-rail">${flagCardStrip(euCards,8)}</div></section>
      <section class="wrap flag-world-banners"><a class="flag-world-banner flag-world-nations" href="produtos.html?region=Sele%C3%A7%C3%B5es"><span>SEM FRONTEIRAS / SELEÇÕES</span><h3>Seu país.<br>Sua paixão.</h3><b>Explorar seleções ${icon('arrow',17)}</b>${flagShowcase('argentina-azul-treino')}</a><a class="flag-world-banner flag-world-street" href="produto.html?id=liverpool-verde"><span>OFF THE PITCH / LIFESTYLE</span><h3>O jogo também<br>acontece na rua.</h3><b>Conhecer o look ${icon('arrow',17)}</b>${flagShowcase('liverpool-verde')}</a><a class="flag-world-banner flag-world-urban" href="produto.html?id=inter-miami-branca"><span>MPJ EDITORIAL / GLOBAL</span><h3>Estilo em<br>todo lugar.</h3><b>Ver produto ${icon('arrow',17)}</b>${flagShowcase('inter-miami-branca')}</a></section>
      <section class="wrap flag-section flag-world-products">${flagSectionHeader('ACERVO GLOBAL','Vista as cores do mundo.','Seleções e uniformes especiais para quem vive futebol.','produtos.html?region=Sele%C3%A7%C3%B5es')}<div class="flag-product-rail flag-short-rail">${flagCardStrip(selCards,6)}</div></section>
      <section class="flag-brand-section"><div class="wrap"><span class="flag-eyebrow">IDENTIDADES DO FUTEBOL</span><h2>Marcas que fazem parte do jogo.</h2><p>Marcas visíveis em produtos fotografados no nosso catálogo; sem vínculo comercial declarado.</p><div class="flag-brand-row">${brandLabels.map(label=>`<span>${label}</span>`).join('')}</div></div></section>
      <section class="wrap flag-finder-section"><div class="flag-finder-intro"><span class="flag-eyebrow">SEU ESTILO, SEU JOGO</span><h2>Não sabe por onde começar?<br><em>Deixa que a gente te ajuda.</em></h2><p>Filtre sua próxima camisa por região e tipo. A seleção é feita com os produtos cadastrados, sem sugestões inventadas.</p><button class="flag-pill-btn flag-surprise" data-action="random-product">Quero uma surpresa ${icon('arrow',17)}</button></div><div class="flag-finder-controls"><span class="flag-control-label">01 / ONDE VOCÊ TORCE?</span><div class="flag-choice-list">${['Todos','Brasil','Europa','Seleções'].map(t=>`<button data-action="finder-region" data-value="${t}" class="${t===finderRegion?'selected':''}" aria-pressed="${t===finderRegion}">${t}</button>`).join('')}</div><span class="flag-control-label">02 / QUAL ESTILO COMBINA COM VOCÊ?</span><div class="flag-choice-list">${['Todos','Titular','Especial','Treino'].map(t=>`<button data-action="finder-style" data-value="${t}" class="${t===finderStyle?'selected':''}" aria-pressed="${t===finderStyle}">${t}</button>`).join('')}</div><span class="flag-control-label">03 / ENCONTRAMOS PARA VOCÊ</span><div id="neo-finder-result" class="flag-finder-results">${finderResults().map(p=>`<a class="neo-finder-card" href="produto.html?id=${encodeURIComponent(p.id)}"><span class="neo-finder-photo">${imageBlock(p)}</span><span class="neo-finder-name"><small>${html(p.kit)} · ${html(p.region)}</small><strong>${html(p.club)}</strong><b>${brl(p.price)}</b></span>${icon('arrow',17)}</a>`).join('')}</div></div></section>
      <section class="flag-last-call"><div class="wrap"><div><span>MPJ / SEMPRE MAIS CAMISAS</span><h2>Tem espaço para mais<br><em>uma história.</em></h2><p>Uma coleção viva. Novos produtos podem ser adicionados ao catálogo sem reconstruir o site.</p></div><a href="produtos.html">Explorar o catálogo ${icon('arrow',19)}</a></div></section>
    </div>`)
  }
  const queryState={q:params.get('q')||'',region:params.get('region')||params.get('regiao')||'',club:params.get('club')||'',kit:params.get('kit')||'',size:params.get('size')||'',sort:params.get('sort')||'popular',sale:false,max:Number(params.get('max'))||Math.ceil(Math.max(...BASE.map(p=>Number(p.price)||0),600)/50)*50};
  let catalogVisible=16,catalogDensity='comfortable';
  function selection(){let out=products().filter(p=>{const text=tidy([p.club,p.country,p.region,p.kit,p.season,p.edition||'',p.description].join(' '));return(!queryState.q||text.includes(tidy(queryState.q)))&&(!queryState.region||p.region===queryState.region)&&(!queryState.club||p.club===queryState.club)&&(!queryState.kit||p.kit===queryState.kit)&&(!queryState.size||(p.sizes||[]).includes(queryState.size))&&p.price<=Number(queryState.max)});if(queryState.sort==='asc')out.sort((a,b)=>a.price-b.price);if(queryState.sort==='desc')out.sort((a,b)=>b.price-a.price);if(queryState.sort==='name')out.sort((a,b)=>a.club.localeCompare(b.club,'pt-BR'));if(queryState.sort==='popular'){const pin=['palmeiras','flamengo','corinthians','real-madrid','barcelona','sao-paulo','santos','liverpool','mirassol','gremio','juventus','vasco','bayern','psg','atletico-mg','argentina-azul-treino'];out.sort((a,b)=>{const ai=pin.indexOf(a.id),bi=pin.indexOf(b.id);return (ai<0?999:ai)-(bi<0?999:bi)||((b.ranking||0)-(a.ranking||0))})}if(queryState.sort==='new')out.sort((a,b)=>(b.order??999)-(a.order??999));return out}
  const departments=[['','Todas as camisas','A coleção completa'],['Brasil','Times brasileiros','Tradição e paixão'],['Europa','Clubes europeus','Futebol pelo mundo'],['Seleções','Seleções','Cada país, uma história'],['América do Norte','América do Norte','Além das fronteiras']];
  function catalog(){
    const list=products(),counts=new Map(departments.map(d=>[d[0],d[0]?list.filter(p=>p.region===d[0]).length:list.length]));
    const title=queryState.region?({Brasil:'Camisas de Times Brasileiros',Europa:'Camisas de Times Europeus','Seleções':'Camisas de Seleções','América do Norte':'Camisas da América do Norte'}[queryState.region]||'Camisas de futebol'):'Camisas de Futebol';
    const clubs=[...new Set(list.filter(p=>!queryState.region||p.region===queryState.region).map(p=>p.club))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    const models=[...new Set(list.map(p=>p.kit||'Titular'))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    const featured=['palmeiras','flamengo','corinthians','sao-paulo','santos','vasco','gremio','real-madrid','barcelona','liverpool','juventus','argentina-azul-treino'].map(getProduct).filter(Boolean);
    shell(`<div class="retail-catalog">
      <div class="wrap retail-breadcrumb"><a href="index.html">Início</a><span>›</span><a href="produtos.html">Camisas de futebol</a>${queryState.region?`<span>›</span><span>${html(queryState.region)}</span>`:''}</div>
      <section class="wrap retail-category-intro"><div class="retail-intro-copy"><div class="retail-small-label">MPJ IMPORTS <span>•</span> DEPARTAMENTO FUTEBOL</div><h1>${title}</h1><p>As cores que movem a torcida. Descubra as camisas da nossa coleção, com fotografias reais e um catálogo feito para explorar sem pressa.</p><div class="retail-intro-meta"><span>${icon('check',17)} ${list.length} camisas na coleção</span><span>${icon('shield',17)} Fotos enviadas para o projeto</span></div></div><div class="retail-intro-images"><span class="retail-poster-label">ENCONTRE SEU MANTO</span>${['flamengo','palmeiras','real-madrid'].map((id,i)=>{const p=getProduct(id);return p?`<img class="retail-poster-shirt poster-${i}" src="${image(p)}" alt="Camisa ${html(p.club)}">`:''}).join('')}</div></section>
      <section class="wrap retail-explore"><div class="retail-section-caption"><h2>Explore por categoria</h2><span>ESCOLHA SEU FUTEBOL</span></div><div class="retail-departments" role="group" aria-label="Filtrar departamento">${departments.map(([value,label,subtitle])=>`<button class="retail-department ${queryState.region===value?'active':''}" data-action="catalog-region" data-region="${html(value)}" aria-pressed="${queryState.region===value}"><span class="retail-category-icon">${value==='Brasil'?'BR':value==='Europa'?'EU':value==='Seleções'?'SE':value==='América do Norte'?'AM':'MPJ'}</span><span class="retail-department-copy"><b>${label}</b><small>${counts.get(value)} produtos</small></span>${icon('arrow',17)}</button>`).join('')}</div></section>
      <section class="wrap retail-team-section"><div class="retail-section-caption"><h2>Encontre seu clube</h2><span>SEU TIME, SEU ESTILO</span></div><div class="retail-team-rail">${featured.map(p=>`<button type="button" class="retail-team-chip ${queryState.club===p.club?'active':''}" data-action="catalog-club" data-club="${html(p.club)}" data-region="${html(p.region)}" aria-label="Filtrar por ${html(p.club)}"><span>${imageBlock(p)}</span><b>${html(p.club)}</b></button>`).join('')}</div></section>
      <div class="wrap retail-divider"></div>
      <section class="wrap retail-market"><aside class="filter-aside retail-filter-panel" id="filter-panel" aria-label="Filtros da loja">
        <div class="retail-filter-title"><div>${icon('sliders',19)} <strong>Filtros</strong></div><button type="button" data-action="close-filters" class="filter-close" aria-label="Fechar filtros">${icon('close',19)}</button></div>
        <details class="retail-filter-group" open><summary>Departamento ${icon('chevron',16)}</summary><div class="retail-filter-options">${departments.map(([value,label])=>`<label class="retail-filter-option"><input type="radio" name="region" value="${html(value)}" ${queryState.region===value?'checked':''}><span>${label}</span><small>${counts.get(value)}</small></label>`).join('')}</div></details>
        <details class="retail-filter-group" open><summary>Clube / Seleção ${icon('chevron',16)}</summary><div class="retail-filter-options retail-filter-scroll"><label class="retail-filter-option"><input type="radio" name="club" value="" ${!queryState.club?'checked':''}><span>Todos os times</span></label>${clubs.map(c=>`<label class="retail-filter-option"><input type="radio" name="club" value="${html(c)}" ${queryState.club===c?'checked':''}><span>${html(c)}</span><small>${list.filter(p=>p.club===c).length}</small></label>`).join('')}</div></details>
        <details class="retail-filter-group" open><summary>Tipo de camisa ${icon('chevron',16)}</summary><div class="retail-filter-options"><label class="retail-filter-option"><input type="radio" name="kit" value="" ${!queryState.kit?'checked':''}><span>Todos os modelos</span></label>${models.map(k=>`<label class="retail-filter-option"><input type="radio" name="kit" value="${html(k)}" ${queryState.kit===k?'checked':''}><span>${html(k)}</span></label>`).join('')}</div></details>
        <details class="retail-filter-group" open><summary>Tamanho ${icon('chevron',16)}</summary><div class="filter-sizes retail-filter-sizes">${['',...[...new Set(list.flatMap(p=>sizesOf(p)))].sort()].map(k=>`<button type="button" data-action="filter-size" data-size="${k}" class="${queryState.size===k?'active':''}">${k||'Todos'}</button>`).join('')}</div></details>
        <details class="retail-filter-group" open><summary>Faixa de preço ${icon('chevron',16)}</summary><div class="retail-price-group"><label for="max-price">Até <strong id="max-price-label">${brl(queryState.max)}</strong></label><input type="range" min="100" max="${Math.ceil(Math.max(...list.map(p=>p.price),600)/50)*50}" step="10" id="max-price" value="${queryState.max}"><div class="retail-price-range"><span>R$ 100</span><span>${brl(Math.ceil(Math.max(...list.map(p=>p.price),600)/50)*50)}</span></div></div></details>
        
        <button type="button" data-action="clear-filters" class="retail-clear">Limpar todos os filtros ${icon('close',16)}</button><p class="retail-filter-note">Preços de referência; disponibilidade não verificada.</p>
      </aside>
      <div class="retail-results"><div class="retail-results-top"><div><span class="retail-small-label">NOSSA COLEÇÃO</span><h2>Todos os mantos</h2><p><strong id="found-count">${list.length}</strong> produtos encontrados</p></div><div class="retail-toolbar"><button type="button" class="retail-mobile-filter" data-action="open-filters">${icon('filter',18)} Filtros</button><label for="sort-products">Ordenar por</label><select id="sort-products"><option value="popular">Em destaque</option><option value="new">Novidades</option><option value="asc">Menor preço</option><option value="desc">Maior preço</option><option value="name">Nome A–Z</option></select><div class="retail-density"><button data-action="catalog-density" data-density="comfortable" title="Visualização confortável" aria-label="Visualização confortável" class="active">${icon('grid',18)}</button><button data-action="catalog-density" data-density="compact" title="Visualização compacta" aria-label="Visualização compacta">▦</button></div></div></div>
      <div id="active-filters" class="retail-active-filters" aria-label="Filtros aplicados"></div><div class="products-grid catalog-grid retail-products" id="catalog-grid"></div><div id="retail-pagination" class="retail-pagination"></div></div></section>
      <section class="wrap retail-end-note"><div>${icon('shield',25)}<span><b>Fotografias reais</b><small>Produtos cadastrados com imagens fornecidas para o projeto</small></span></div><div>${icon('heart',25)}<span><b>Seus favoritos</b><small>Guarde seus modelos preferidos neste navegador</small></span></div><div>${icon('truck',25)}<span><b>Compra demonstrativa</b><small>Valores e entrega apenas para apresentação</small></span></div></section>
    </div>`);
    $('#sort-products').value=queryState.sort;renderSelection()
  }
  function renderSelection(){const grid=$('#catalog-grid');if(!grid)return;const list=selection();grid.classList.toggle('is-compact',catalogDensity==='compact');grid.innerHTML=list.length?list.slice(0,catalogVisible).map(card).join(''):`<div class="empty-result">${icon('search',36)}<h3>Não encontramos camisas</h3><p>Experimente trocar de time ou limpar algum filtro.</p><button data-action="clear-filters" class="btn btn-dark">Limpar filtros</button></div>`;
    $('#found-count').textContent=list.length;
    const tags=[['region',queryState.region],['club',queryState.club],['kit',queryState.kit],['size',queryState.size],['q',queryState.q?'Busca: '+queryState.q:'']].filter(x=>x[1]);
    $('#active-filters').innerHTML=tags.map(([field,value])=>`<button type="button" data-action="catalog-remove" data-field="${field}">${html(value)} ${icon('close',13)}</button>`).join('');
    const more=$('#retail-pagination');more.innerHTML=list.length>catalogVisible?`<div class="retail-progress"><span>Exibindo ${catalogVisible} de ${list.length} camisas</span><div><i style="width:${Math.round(100*catalogVisible/list.length)}%"></i></div></div><button type="button" data-action="catalog-more">Carregar mais produtos ${icon('arrow',17)}</button>`:list.length?`<p>Você visualizou todos os ${list.length} produtos encontrados.</p>`:'';
    $$('[data-action="filter-size"]').forEach(b=>b.classList.toggle('active',b.dataset.size===queryState.size));
    $$('[data-action="catalog-region"]').forEach(b=>{let active=b.dataset.region===queryState.region;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
    $$('[data-action="catalog-club"]').forEach(b=>b.classList.toggle('active',b.dataset.club===queryState.club));
    $$('[data-action="catalog-density"]').forEach(b=>b.classList.toggle('active',b.dataset.density===catalogDensity));renderCompareTray();
  }
  function detail(){
    const p=getProduct(params.get('id'));
    if(!p){shell(`<div class="wrap empty-page"><h1>Camisa não encontrada.</h1><a class="btn btn-dark" href="produtos.html">Ver catálogo</a></div>`);return}
    remember(p.id);const photos=productImages(p);const more=products().filter(x=>x.id!==p.id&&x.club===p.club).slice(0,4);
    const related=more.length?more:products().filter(x=>x.id!==p.id&&x.region===p.region).slice(0,4);
    shell(`<div class="wrap xp-detail-wrap"><div class="breadcrumbs"><a href="index.html">Início</a> / <a href="produtos.html?region=${encodeURIComponent(p.region)}">${html(p.region)}</a> / ${html(p.club)}</div>
    <div class="detail-layout xp-detail-layout"><div class="detail-gallery"><div class="detail-shot xp-detail-shot"><span class="shot-label">MPJ / FOTO ORIGINAL</span><img class="detail-img" id="xp-detail-img" src="${html(photos[0])}" alt="Camisa ${html(p.club)}" tabindex="0" loading="eager">
    ${photos.length>1?`<button class="xp-gallery-prev" type="button" data-action="gallery-prev" aria-label="Foto anterior">‹</button><button class="xp-gallery-next" type="button" data-action="gallery-next" aria-label="Próxima foto">›</button>`:''}<button type="button" data-action="zoom" data-id="${html(p.id)}" class="zoom-control">${icon('eye',18)} Ampliar foto</button></div>
    ${photos.length>1?`<div class="xp-gallery-thumbs" aria-label="Galeria de fotos">${photos.map((src,i)=>`<button type="button" class="xp-gallery-thumb ${i===0?'active':''}" data-action="gallery-set" data-slide="${i}" aria-label="Ver foto ${i+1}"><img src="${html(src)}" alt="Ângulo ${i+1}"></button>`).join('')}</div>`:''}<div class="image-hint">Fotografias enviadas para o projeto. Imagens ilustrativas do produto.</div></div>
    <div class="detail-info"><div class="product-path">${html(p.region)} / ${html(p.kit||'Camisa')}</div><h1>Camisa ${html(p.club)}${p.edition?' — '+html(p.edition):''} <span>· ${html(p.season||'')}</span></h1><p class="detail-desc">${html(p.description||'Uniforme integrante do acervo MPJ IMPORTS. Fotografia fornecida para o projeto.')}</p><div class="detail-rule"></div><div class="detail-amount">${brl(p.price)}</div><div class="detail-installments">Preço demonstrativo · frete não incluído</div>
    <form id="add-cart-form" class="xp-purchase-form" novalidate><fieldset class="xp-fieldset"><legend>Escolha uma opção de tamanho *</legend><div class="size-choices">${sizesOf(p).map(s=>`<label><input name="size" type="radio" value="${html(s)}" required><span>${html(s)}</span></label>`).join('')}</div>${sizesOf(p).includes('A combinar')?'<p class="xp-size-note">Tamanhos reais ainda não cadastrados. Escolha “A combinar” para consultar pelo WhatsApp.</p>':''}</fieldset>
    ${modelsOf(p).length?`<fieldset class="xp-fieldset"><legend>Modelo *</legend><div class="size-choices">${modelsOf(p).map(m=>`<label><input name="model" type="radio" value="${html(m)}" required><span>${html(m)}</span></label>`).join('')}</div></fieldset>`:''}
    ${p.sizeGuide&&Array.isArray(p.sizeGuide)?`<button type="button" data-action="size-guide" data-id="${html(p.id)}" class="size-guide-link">Guia de medidas ${icon('arrow',15)}</button>`:''}
    <div class="qty-label">Quantidade</div><div class="qty-line"><div class="qty-picker"><button type="button" data-action="qty-minus" aria-label="Diminuir quantidade">${icon('minus',16)}</button><input id="detail-qty" type="number" min="1" max="20" value="1" aria-label="Quantidade"><button type="button" data-action="qty-plus" aria-label="Aumentar quantidade">${icon('plus',16)}</button></div><button type="submit" class="btn btn-lime buy-btn">${icon('bag',20)} Adicionar ao carrinho</button></div><p class="xp-validation" id="xp-detail-warning" aria-live="polite"></p></form>
    <div class="xp-detail-actions"><button data-action="favorite" data-id="${html(p.id)}" class="fav-detail">${icon('heart',18)} ${saved.favorites.includes(p.id)?'Remover dos favoritos':'Favoritar'}</button><button data-action="compare-toggle" data-id="${html(p.id)}">${icon('swap',17)} Comparar</button><button data-action="share" data-id="${html(p.id)}">${icon('upload',16)} Compartilhar</button></div><div class="product-promises"><p>${icon('shield',20)} Sem confirmação de estoque ou disponibilidade.</p><p>Seus dados de carrinho e favoritos ficam somente neste navegador.</p></div></div></div></div>
    <div class="xp-mobile-buy"><span>${brl(p.price)}</span><button type="button" data-action="jump-buy">Escolher tamanho ${icon('arrow',16)}</button></div>
    ${related.length?`<section class="wrap home-products">${heading('MAIS PARA EXPLORAR','Você também pode gostar','','produtos.html')}<div class="products-grid">${related.map(card).join('')}</div></section>`:''}`);
  }
  function favPage(){const list=products().filter(p=>saved.favorites.includes(p.id));shell(`<div class="wrap page-top"><div class="breadcrumbs"><a href="index.html">Início</a> / Favoritos</div><h1>MEUS FAVORITOS<span class="dot">.</span></h1><p>Seus mantos favoritos são guardados neste navegador.</p></div><section class="wrap home-products">${list.length?`<div class="products-grid">${list.map(card).join('')}</div>`:`<div class="empty-page">${icon('heart',45)}<h2>Sua lista está vazia.</h2><p>Explore os produtos e clique no coração para guardar suas camisas favoritas.</p><a class="btn btn-dark" href="produtos.html">EXPLORAR CAMISAS</a></div>`}</section>`)}
  const lineTotal=x=>{const p=getProduct(x.id);return p?Number(p.price)*Number(x.qty):0};
  function total(){const subtotal=saved.cart.reduce((a,i)=>a+lineTotal(i),0);return {subtotal,total:subtotal}}
  function cartItems(){return saved.cart.map(x=>{const p=getProduct(x.id);if(!p)return'';return `<article class="cart-line"><a href="produto.html?id=${encodeURIComponent(p.id)}" class="line-image">${imageBlock(p)}</a><div class="line-info"><a href="produto.html?id=${encodeURIComponent(p.id)}">${html(p.club)}${p.edition?' · '+html(p.edition):''}</a><small>${html(p.kit||'Camisa')} · Tam. ${html(x.size)}${x.model?' · Modelo '+html(x.model):''}</small><b>${brl(p.price)} / un.</b><div class="line-bottom"><div class="cart-qty"><button data-action="cart-minus" data-key="${html(x.key)}" aria-label="Diminuir quantidade">−</button><span>${x.qty}</span><button data-action="cart-plus" data-key="${html(x.key)}" aria-label="Aumentar quantidade">+</button></div><span class="xp-line-sum">${brl(lineTotal(x))}</span><button class="cart-remove" data-action="cart-remove" data-key="${html(x.key)}" aria-label="Remover item">${icon('trash',17)}</button></div></div></article>`}).join('')}
  const totalHtml=()=>{const t=total();return `<div class="total-row"><span>Subtotal dos produtos</span><b>${brl(t.subtotal)}</b></div><div class="total-row total-big"><span>Total dos produtos</span><strong>${brl(t.total)}</strong></div><p class="xp-freight-note">Frete não calculado. Valores de referência, sem pagamento no site.</p>`};
  const whatsappButton=()=>`<button type="button" class="btn btn-lime btn-full xp-whatsapp" data-action="whatsapp">Finalizar pedido pelo WhatsApp ${icon('arrow',17)}</button><p class="xp-whatsapp-note">Enviaremos o resumo para o WhatsApp da loja: (13) 99734-2745. Você deverá tocar em <strong>Enviar</strong> para solicitar a confirmação e combinar o pagamento.</p>`;
  function cartPage(){shell(`<div class="wrap page-top"><div class="breadcrumbs"><a href="index.html">Início</a> / Carrinho</div><h1>Meu carrinho</h1><p>Os itens ficam salvos somente no seu navegador.</p></div><div class="wrap checkout-layout cart-screen"><section class="cart-main">${saved.cart.length?cartItems():`<div class="empty-page">${icon('bag',44)}<h2>Seu carrinho está vazio.</h2><p>Explore as camisas e escolha seu manto.</p><a class="btn btn-dark" href="produtos.html">Continuar comprando</a></div>`}</section>${saved.cart.length?`<aside class="summary-box"><h3>Resumo dos produtos</h3>${totalHtml()}${whatsappButton()}<a href="produtos.html" class="xp-continue">Continuar explorando</a></aside>`:''}</div>`)}
  function drawer(){const d=$('#cart-drawer');if(!d)return;d.innerHTML=`<div class="drawer-heading"><h3>Seu carrinho <small>(${badges().cart})</small></h3><button data-action="close-cart" aria-label="Fechar carrinho">${icon('close',22)}</button></div><div class="drawer-content">${saved.cart.length?cartItems():`<div class="drawer-empty">${icon('bag',39)}<h4>Seu carrinho está vazio.</h4><p>Seu próximo manto está no catálogo.</p><a class="btn btn-dark" href="produtos.html">Ver camisas</a></div>`}</div>${saved.cart.length?`<div class="drawer-checkout">${totalHtml()}${whatsappButton()}<a class="xp-continue" href="carrinho.html">Ver carrinho completo</a></div>`:''}`}
  /* Catálogo estático + estado exclusivamente local. Nenhum pedido é confirmado neste site. */
  function remember(id){
    saved.recently=[id,...saved.recently.filter(v=>v!==id)].slice(0,10);
    persist();
  }
  function recentBlock(){
    const current=params.get('id');
    const ids=saved.recently.filter(id=>id!==current).slice(0,6);
    const arr=ids.map(getProduct).filter(Boolean);
    if(!arr.length)return '';
    return `<section class="wrap xp-recent"><div class="xp-section-title"><span>SEU HISTÓRICO LOCAL</span><h2>Vistos recentemente</h2><p>Disponíveis apenas neste navegador, sem sincronização.</p></div><div class="products-grid">${arr.map(card).join('')}</div></section>`;
  }
  let lastTrigger=null, activeGallery=0;
  function showDialog(dialog,opener){
    if(!dialog)return;
    lastTrigger=opener||document.activeElement;
    if(!dialog.open)dialog.showModal();
    const focusable=dialog.querySelector('button:not([disabled]),a[href],input:not([disabled])');focusable?.focus();
  }
  function closeDialog(dialog){if(dialog?.open)dialog.close();if(lastTrigger?.isConnected)lastTrigger.focus()}
  function chooseSize(id,trigger){openQuick(id,trigger)}
  function openQuick(id,trigger){
    const p=getProduct(id);if(!p)return;
    remember(id);
    const d=$('#quick-modal');if(!d)return;
    const imgs=productImages(p);
    d.dataset.productId=id;d.dataset.gallery='0';d.dataset.selectedSize='';d.dataset.selectedModel='';
    d.innerHTML=`<div class="xp-modal-heading"><span>MPJ / VISUALIZAÇÃO RÁPIDA</span><button type="button" data-action="close-modal" aria-label="Fechar detalhes">${icon('close',22)}</button></div>
      <div class="xp-quick-layout"><div class="xp-quick-media"><img id="xp-quick-image" src="${html(imgs[0])}" alt="Camisa ${html(p.club)}" loading="eager">${imgs.length>1?`<div class="xp-quick-thumbs">${imgs.map((src,i)=>`<button type="button" class="${i===0?'active':''}" data-action="quick-gallery" data-slide="${i}" aria-label="Mostrar foto ${i+1}"><img src="${html(src)}" alt="Foto real ${i+1}"></button>`).join('')}</div>`:''}</div>
      <div class="xp-quick-copy"><small>${html(p.region)} · ${html(p.kit)} · ${html(p.season||'')}</small><h2>${html(p.club)}${p.edition?' — '+html(p.edition):''}</h2><p>${html(p.description||'Camisa integrante do acervo MPJ IMPORTS.')}</p><strong class="xp-price">${brl(p.price)}</strong><span class="xp-price-note">Preço de referência · sem frete</span>
      <fieldset class="xp-fieldset"><legend>Selecione o tamanho *</legend><div class="xp-option-list">${sizesOf(p).map(size=>`<button type="button" data-action="quick-size" data-size="${html(size)}" aria-pressed="false">${html(size)}</button>`).join('')}</div></fieldset>
      ${modelsOf(p).length?`<fieldset class="xp-fieldset"><legend>Selecione o modelo *</legend><div class="xp-option-list">${modelsOf(p).map(model=>`<button type="button" data-action="quick-model" data-model="${html(model)}" aria-pressed="false">${html(model)}</button>`).join('')}</div></fieldset>`:''}
      ${sizesOf(p).includes('A combinar')?'<small class="xp-size-note">O tamanho exato será consultado; não há disponibilidade verificada.</small>':''}
      <div class="xp-quick-qty"><label for="xp-quick-quantity">Quantidade</label><input id="xp-quick-quantity" type="number" min="1" max="20" value="1"></div>
      <p class="xp-validation" id="xp-quick-warning" aria-live="polite"></p><button class="xp-quick-buy" type="button" data-action="quick-add-confirm">${icon('bag',18)} Adicionar ao carrinho</button><div class="xp-quick-footer"><a href="produto.html?id=${encodeURIComponent(id)}">Página completa ${icon('arrow',15)}</a><button type="button" data-action="share" data-id="${html(id)}">${icon('upload',16)} Compartilhar</button></div></div></div>`;
    showDialog(d,trigger);
  }
  function quickAddConfirm(){
    const d=$('#quick-modal'),id=d.dataset.productId,p=getProduct(id);
    if(!p)return;
    const size=d.dataset.selectedSize,model=d.dataset.selectedModel||'';
    if(!size||!sizesOf(p).includes(size)){const w=$('#xp-quick-warning');w.textContent='Escolha o tamanho antes de adicionar.';d.querySelector('[data-action="quick-size"]')?.focus();return}
    if(modelsOf(p).length&&!modelsOf(p).includes(model)){const w=$('#xp-quick-warning');w.textContent='Escolha o modelo antes de adicionar.';return}
    const q=Number($('#xp-quick-quantity')?.value);
    if(!Number.isInteger(q)||q<1||q>20){$('#xp-quick-warning').textContent='Escolha uma quantidade entre 1 e 20.';return}
    closeDialog(d);addCart(id,size,q,model);
  }
  function editCart(key,diff){
    const item=saved.cart.find(x=>x.key===key);if(!item)return;
    item.qty=Math.max(0,Math.min(20,item.qty+diff));saved.cart=saved.cart.filter(x=>x.qty>0);
    persist();updateCounts();drawer();if(pageName==='cart')cartPage();
  }
  function addCart(id,size,qty=1,model=''){
    const p=getProduct(id);if(!p||!sizesOf(p).includes(size)||modelsOf(p).length&&!modelsOf(p).includes(model)){notice('Selecione uma opção cadastrada para continuar.');return}
    if(!Number.isInteger(qty)||qty<1||qty>20){notice('Quantidade inválida.');return}
    const key=[id,size,model].join('|');const found=saved.cart.find(x=>x.key===key);
    if(found)found.qty=Math.min(20,found.qty+qty);else saved.cart.push({id,size,model,qty,key});
    const stored=persist();updateCounts();drawer();
    const drawerEl=$('#cart-drawer');drawerEl?.classList.add('open');$('#drawer-dim')?.classList.add('active');drawerEl?.setAttribute('aria-hidden','false');document.body.classList.add('locked');
    drawerEl?.querySelector('[data-action="close-cart"]')?.focus();notice(stored?'Adicionado ao carrinho!':'Adicionado nesta sessão. O navegador bloqueou o salvamento local.');
  }
  function closeCart(){
    $('#cart-drawer')?.classList.remove('open');$('#drawer-dim')?.classList.remove('active');$('#cart-drawer')?.setAttribute('aria-hidden','true');document.body.classList.remove('locked');
  }
  function renderCompareTray(){
    const el=$('#compare-tray');if(!el)return;
    el.innerHTML=saved.compare.length?`<div><b>${saved.compare.length}/3 em comparação</b><span>${saved.compare.map(id=>html(getProduct(id)?.club||'')).join(' · ')}</span></div><button data-action="compare-open" type="button">Comparar agora ${icon('swap',15)}</button><button data-action="compare-clear" type="button" aria-label="Limpar comparação">${icon('close',18)}</button>`:'';
    el.classList.toggle('visible',saved.compare.length>0);
    $$('[data-action="compare-toggle"]').forEach(b=>{const active=saved.compare.includes(b.dataset.id);b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  }
  function toggleCompare(id){
    if(!getProduct(id))return;
    if(saved.compare.includes(id)){saved.compare=saved.compare.filter(v=>v!==id);notice('Removido da comparação.')}else if(saved.compare.length>=3){notice('Compare até três camisas. Remova uma para adicionar outra.');return}else{saved.compare.push(id);notice('Camisa adicionada à comparação.')}
    persist();renderCompareTray();
  }
  function openCompare(trigger){
    const arr=saved.compare.map(getProduct).filter(Boolean);
    const d=$('#compare-modal');if(!d)return;
    d.innerHTML=`<div class="xp-modal-heading"><span>COMPARADOR MPJ · ATÉ 3 MODELOS</span><button type="button" data-action="close-modal" aria-label="Fechar comparação">${icon('close',22)}</button></div><h2>Compare suas camisas</h2>${arr.length?`<div class="xp-compare-scroll"><table class="xp-comparison"><thead><tr><th>Informações</th>${arr.map(p=>`<th><img src="${html(image(p))}" alt="Camisa ${html(p.club)}"><span>${html(p.club)}</span><button data-action="compare-toggle" data-id="${html(p.id)}">Remover</button></th>`).join('')}</tr></thead><tbody>${[['Modelo',p=>p.kit||'Não informado'],['Edição',p=>p.edition||'Não informada'],['Região',p=>p.region],['Temporada',p=>p.season||'Não informada'],['Opção de tamanho',p=>sizesOf(p).join(', ')],['Preço de referência',p=>brl(p.price)]].map(([label,get])=>`<tr><th>${label}</th>${arr.map(p=>`<td>${html(get(p))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p>Escolha camisas no catálogo para comparar.</p>'}`;
    showDialog(d,trigger);
  }
  async function shareProduct(id){
    const p=getProduct(id);if(!p)return;
    const url=new URL('produto.html?id='+encodeURIComponent(id),location.href).href;
    const title='MPJ IMPORTS — '+p.club;
    try{
      if(navigator.share && location.protocol!=='file:'){await navigator.share({title,url});return}
      if(navigator.clipboard&&location.protocol!=='file:')await navigator.clipboard.writeText(url);
      else {const t=document.createElement('textarea');t.value=url;document.body.append(t);t.select();if(!document.execCommand('copy'))throw Error('Copie o endereço do navegador.');t.remove()}
      notice(location.protocol==='file:'?'Link local copiado; em outro dispositivo, será preciso publicar o site.':'Link do produto copiado!');
    }catch(e){if(e?.name!=='AbortError')notice('Não foi possível compartilhar. Copie o endereço do produto.');}
  }
  function openWhatsApp(){
    const phone=String(window.MPJ_CONFIG?.whatsapp||'').replace(/\D/g,'');
    if(!/^55\d{10,11}$/.test(phone)){notice('WhatsApp não configurado. Edite js/config.js com o número da loja.');return}
    if(!saved.cart.length){notice('Adicione uma camisa ao carrinho primeiro.');return}
    const rows=saved.cart.map((x,i)=>{const p=getProduct(x.id);if(!p)return'';return `${i+1}. ${p.club}${p.edition?' — '+p.edition:''}\n   Modelo: ${x.model||p.kit||'Não informado'}\n   Tamanho: ${x.size}\n   Quantidade: ${x.qty}\n   Unitário: ${brl(p.price)}\n   Subtotal: ${brl(lineTotal(x))}`}).filter(Boolean);
    const message=`*MPJ IMPORTS — SOLICITAÇÃO DE PEDIDO*\n\nOlá! Gostaria de finalizar a compra dos seguintes produtos:\n\n${rows.join('\n\n')}\n\n*Total dos produtos (sem frete): ${brl(total().total)}*\nFrete: a combinar com a loja.\n\nPoderiam confirmar a disponibilidade, os tamanhos e o valor final e me passar as orientações para pagamento e entrega?\n\n*Esta é uma solicitação: o pedido só estará confirmado após resposta da loja.*`;
    window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
    notice('WhatsApp aberto com o resumo. Toque em Enviar para solicitar a confirmação do pedido.');
  }
  function showSizeGuide(id,trigger){
    const guide=getProduct(id)?.sizeGuide;if(!Array.isArray(guide)||!guide.length)return;
    const d=$('#size-modal');d.innerHTML=`<div class="xp-modal-heading"><span>MEDIDAS INFORMADAS</span><button type="button" data-action="close-modal" aria-label="Fechar guia">${icon('close',20)}</button></div><h2>Guia de tamanhos</h2><table class="xp-guide">${guide.map(row=>`<tr>${Object.values(row).map(v=>`<td>${html(v)}</td>`).join('')}</tr>`).join('')}</table>`;showDialog(d,trigger);
  }
  function setGallery(i){
    const p=getProduct(params.get('id'));if(!p)return;
    const imgs=productImages(p);activeGallery=(i+imgs.length)%imgs.length;
    const img=$('#xp-detail-img');if(img){img.src=imgs[activeGallery];img.alt=`Camisa ${p.club} — foto ${activeGallery+1}`}
    $$('.xp-gallery-thumb').forEach((el,n)=>el.classList.toggle('active',n===activeGallery));
  }
  function syncCatalogUrl(){
    if(pageName!=='catalog')return;
    const q=new URLSearchParams();
    for(const field of ['q','region','club','kit','size','sort'])if(queryState[field]&&!(field==='sort'&&queryState.sort==='popular'))q.set(field,queryState[field]);
    if(queryState.max<Math.ceil(Math.max(...BASE.map(p=>p.price),600)/50)*50)q.set('max',queryState.max);
    try{history.replaceState(null,'','produtos.html'+(q.size?'?'+q:''))}catch{}
  }
  function setup(){
    document.addEventListener('mouseover',e=>{const b=e.target.closest('[data-action="collab-hover"]');if(b)updateCollabHero(b.dataset.src,b.dataset.label,b)});
    document.addEventListener('focusin',e=>{const b=e.target.closest('[data-action="collab-hover"]');if(b)updateCollabHero(b.dataset.src,b.dataset.label,b)});
    document.addEventListener('click',e=>{
      const b=e.target.closest('[data-action]');if(!b)return;
      const a=b.dataset.action,id=b.dataset.id;
      switch(a){
      case 'quick-view':case 'size-picker':openQuick(id,b);break;
      case 'quick-size':{const d=$('#quick-modal');d.dataset.selectedSize=b.dataset.size;$$('[data-action="quick-size"]',d).forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});$('#xp-quick-warning').textContent='';break}
      case 'quick-model':{const d=$('#quick-modal');d.dataset.selectedModel=b.dataset.model;$$('[data-action="quick-model"]',d).forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});$('#xp-quick-warning').textContent='';break}
      case 'quick-gallery':{const d=$('#quick-modal'),p=getProduct(d.dataset.productId),i=Number(b.dataset.slide);if(!p)return;$('#xp-quick-image').src=productImages(p)[i];$$('[data-action="quick-gallery"]').forEach(x=>x.classList.toggle('active',x===b));break}
      case 'quick-add-confirm':quickAddConfirm();break;
      case 'close-modal':closeDialog(b.closest('dialog'));break;
      case 'compare-toggle':toggleCompare(id);if($('#compare-modal')?.open)openCompare(b);break;
      case 'compare-open':openCompare(b);break;
      case 'compare-clear':saved.compare=[];persist();renderCompareTray();break;
      case 'share':shareProduct(id);break;
      case 'whatsapp':openWhatsApp();break;
      case 'gallery-prev':setGallery(activeGallery-1);break;
      case 'gallery-next':setGallery(activeGallery+1);break;
      case 'gallery-set':setGallery(Number(b.dataset.slide));break;
      case 'jump-buy':$('#add-cart-form')?.scrollIntoView({behavior:'smooth',block:'center'});$('#add-cart-form input[name="size"]')?.focus({preventScroll:true});break;
      case 'size-guide':showSizeGuide(id,b);break;
      case 'catalog-region':queryState.region=b.dataset.region||'';queryState.club='';queryState.q='';catalogVisible=16;syncCatalogUrl();catalog();document.querySelector('.retail-market')?.scrollIntoView({block:'start'});break;
      case 'catalog-club':queryState.club=b.dataset.club||'';queryState.region=b.dataset.region||'';queryState.q='';catalogVisible=16;syncCatalogUrl();catalog();break;
      case 'catalog-more':catalogVisible+=16;renderSelection();break;
      case 'catalog-density':catalogDensity=b.dataset.density==='compact'?'compact':'comfortable';renderSelection();break;
      case 'catalog-remove':{let field=b.dataset.field;if(field==='sale')queryState.sale=false;else if(field in queryState)queryState[field]='';catalogVisible=16;syncCatalogUrl();catalog();break}
      case 'filter-size':queryState.size=b.dataset.size;catalogVisible=16;syncCatalogUrl();renderSelection();break;
      case 'clear-filters':queryState.q='';queryState.region='';queryState.club='';queryState.kit='';queryState.size='';queryState.sale=false;queryState.sort='popular';queryState.max=Math.ceil(Math.max(...BASE.map(p=>p.price),600)/50)*50;catalogVisible=16;syncCatalogUrl();catalog();break;
      case 'open-filters':$('#filter-panel')?.classList.add('filters-open');break;
      case 'close-filters':$('#filter-panel')?.classList.remove('filters-open');break;
      case 'flag-next':flagshipActive=(flagshipActive+1)%flagshipSlides.length;renderFlagship();break;
      case 'flag-prev':flagshipActive=(flagshipActive+flagshipSlides.length-1)%flagshipSlides.length;renderFlagship();break;
      case 'flag-slide':flagshipActive=Math.max(0,Math.min(flagshipSlides.length-1,Number(b.dataset.slide)||0));renderFlagship();break;
      case 'collab-hover':updateCollabHero(b.dataset.src,b.dataset.label,b);break;
      case 'flag-tab':featuredCategory=b.dataset.category||'Todos';flagRenderFeatured();break;
      case 'flag-rail-left':$('#flag-highlights-rail')?.scrollBy({left:-750,behavior:'smooth'});break;
      case 'flag-rail-right':$('#flag-highlights-rail')?.scrollBy({left:750,behavior:'smooth'});break;
      case 'hero-next':activeHero=(activeHero+1)%heroes.length;renderHero();break;
      case 'hero-prev':activeHero=(activeHero+heroes.length-1)%heroes.length;renderHero();break;
      case 'hero-dot':activeHero=Math.max(0,Math.min(heroes.length-1,Number(b.dataset.slide)||0));renderHero();break;
      case 'feature-tab':featuredCategory=b.dataset.category||'Todos';drawFeatured();break;
      case 'finder-region':finderRegion=b.dataset.value||'Todos';drawFinder();break;
      case 'finder-style':finderStyle=b.dataset.value||'Todos';drawFinder();break;
      case 'rail-left':$('#featured-product-grid')?.scrollBy({left:-560,behavior:'smooth'});break;
      case 'rail-right':$('#featured-product-grid')?.scrollBy({left:560,behavior:'smooth'});break;
      case 'random-product':{const a=products();if(a.length)location.href='produto.html?id='+encodeURIComponent(a[Math.floor(Math.random()*a.length)].id);break}
      case 'mobile-menu':$('#mobile-menu')?.classList.toggle('open');break;
      case 'departments':{const el=$('#department-menu');if(!el)return;const open=el.classList.toggle('open');b.setAttribute('aria-expanded',String(open));break}
      case 'open-cart':drawer();$('#cart-drawer')?.classList.add('open');$('#drawer-dim')?.classList.add('active');$('#cart-drawer')?.setAttribute('aria-hidden','false');document.body.classList.add('locked');$('#cart-drawer [data-action="close-cart"]')?.focus();break;
      case 'close-cart':closeCart();$('.head-cart')?.focus();break;
      case 'favorite':{
        saved.favorites=saved.favorites.includes(id)?saved.favorites.filter(x=>x!==id):[...saved.favorites,id];persist();updateCounts();
        if(pageName==='favorites')favPage();else if(pageName==='product'){
          $$('[data-action="favorite"][data-id="'+id+'"]').forEach(x=>{const on=saved.favorites.includes(id);x.classList.toggle('selected',on);x.setAttribute('aria-pressed',String(on));if(x.classList.contains('fav-detail'))x.innerHTML=icon('heart',18)+(on?' Remover dos favoritos':' Favoritar')});
        } else $$('[data-action="favorite"][data-id="'+id+'"]').forEach(x=>{const on=saved.favorites.includes(id);x.classList.toggle('selected',on);x.setAttribute('aria-pressed',String(on));x.setAttribute('aria-label',on?'Remover dos favoritos':'Adicionar aos favoritos')});
        notice(saved.favorites.includes(id)?'Salvo nos favoritos.':'Removido dos favoritos.');break}
      case 'cart-plus':editCart(b.dataset.key,1);break;
      case 'cart-minus':editCart(b.dataset.key,-1);break;
      case 'cart-remove':saved.cart=saved.cart.filter(x=>x.key!==b.dataset.key);persist();updateCounts();drawer();if(pageName==='cart')cartPage();notice('Produto removido do carrinho.');break;
      case 'qty-minus':{const f=$('#detail-qty');if(f)f.value=Math.max(1,Number(f.value)-1);break}
      case 'qty-plus':{const f=$('#detail-qty');if(f)f.value=Math.min(20,Number(f.value)+1);break}
      case 'zoom':{
        const p=getProduct(id);if(!p)return;const d=$('#zoom-modal');d.innerHTML=`<button data-action="close-modal" aria-label="Fechar foto">${icon('close',24)}</button><img src="${html(productImages(p)[activeGallery]||image(p))}" alt="Foto ampliada do ${html(p.club)}">`;showDialog(d,b);break}
      case 'back-top':scrollTo({top:0,behavior:'smooth'});break;
      }
    });
    document.addEventListener('submit',e=>{
      const form=e.target;
      if(form.id==='head-search-form'){e.preventDefault();const q=$('#global-search').value.trim();location.href='produtos.html'+(q?'?q='+encodeURIComponent(q):'');}
      if(form.id==='add-cart-form'){
        e.preventDefault();const p=getProduct(params.get('id'));if(!p)return;
        const values=new FormData(form),size=String(values.get('size')||''),model=String(values.get('model')||'');
        const qty=Number($('#detail-qty')?.value);const warning=$('#xp-detail-warning');
        if(!size||!sizesOf(p).includes(size)){warning.textContent='Escolha uma opção de tamanho.';form.querySelector('input[name="size"]')?.focus();return}
        if(modelsOf(p).length&&!modelsOf(p).includes(model)){warning.textContent='Escolha o modelo antes de continuar.';return}
        if(!Number.isInteger(qty)||qty<1||qty>20){warning.textContent='Quantidade deve estar entre 1 e 20.';return}
        warning.textContent='';addCart(p.id,size,qty,model);
      }
    });
    document.addEventListener('input',e=>{
      if(e.target.id==='global-search'){
        const v=e.target.value.trim(),panel=$('#suggestions');if(!panel)return;
        const found=v?products().filter(p=>tidy([p.club,p.region,p.kit,p.country,p.edition||'',p.season].join(' ')).includes(tidy(v))).slice(0,6):[];
        panel.innerHTML=found.map(p=>`<a href="produto.html?id=${encodeURIComponent(p.id)}">${imageBlock(p)}<span>${html(p.club)}<small>${html(p.kit)} · ${brl(p.price)}</small></span>${icon('arrow',16)}</a>`).join('');panel.classList.toggle('active',found.length>0);
        if(pageName==='catalog'){queryState.q=v;catalogVisible=16;syncCatalogUrl();renderSelection()}
      }
      if(e.target.id==='max-price'){queryState.max=Number(e.target.value);$('#max-price-label').textContent=brl(queryState.max);syncCatalogUrl();renderSelection()}
    });
    document.addEventListener('change',e=>{
      if(pageName!=='catalog')return;
      if(e.target.name==='region'){queryState.region=e.target.value;queryState.club='';catalogVisible=16;syncCatalogUrl();catalog()}
      if(e.target.name==='club'){queryState.club=e.target.value;catalogVisible=16;syncCatalogUrl();renderSelection()}
      if(e.target.name==='kit'){queryState.kit=e.target.value;catalogVisible=16;syncCatalogUrl();renderSelection()}
      if(e.target.id==='sort-products'){queryState.sort=e.target.value;catalogVisible=16;syncCatalogUrl();renderSelection()}
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){closeCart();$('#mobile-menu')?.classList.remove('open');$('#department-menu')?.classList.remove('open')}
      if(pageName==='product'&&['ArrowLeft','ArrowRight'].includes(e.key)&&document.activeElement?.id==='xp-detail-img'){e.preventDefault();setGallery(activeGallery+(e.key==='ArrowLeft'?-1:1))}
      if(e.key==='Tab'){
        const open=$$('dialog').find(d=>d.open);if(!open)return;
        const focus=$$('a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]',open).filter(x=>x.offsetParent!==null);
        if(!focus.length)return;
        if(e.shiftKey&&document.activeElement===focus[0]){e.preventDefault();focus[focus.length-1].focus()}
        else if(!e.shiftKey&&document.activeElement===focus[focus.length-1]){e.preventDefault();focus[0].focus()}
      }
    });
    document.addEventListener('close',e=>{if(e.target.matches('dialog')&&lastTrigger?.isConnected)lastTrigger.focus()},true);
    document.addEventListener('click',e=>{if(!e.target.closest('.head-search'))$('#suggestions')?.classList.remove('active')});
    let startX=null;
    document.addEventListener('touchstart',e=>{if(e.target.closest('.xp-detail-shot'))startX=e.touches[0].screenX},{passive:true});
    document.addEventListener('touchend',e=>{if(startX===null)return;const delta=e.changedTouches[0].screenX-startX;startX=null;if(Math.abs(delta)>45)setGallery(activeGallery+(delta<0?1:-1))},{passive:true});
    window.addEventListener('scroll',()=>{$('.back-top')?.classList.toggle('show',scrollY>550)},{passive:true});
  }
  function start(){
    saved.cart=saved.cart.filter(x=>x&&getProduct(x.id)&&sizesOf(getProduct(x.id)).includes(x.size)&&Number.isInteger(x.qty)&&x.qty>=1&&x.qty<=20).map(x=>({...x,model:x.model||'',key:[x.id,x.size,x.model||''].join('|')}));
    saved.favorites=[...new Set(saved.favorites.filter(x=>getProduct(x)))];
    saved.compare=[...new Set(saved.compare.filter(x=>getProduct(x)))].slice(0,3);
    saved.recently=[...new Set(saved.recently.filter(x=>getProduct(x)))].slice(0,10);
    switch(pageName){case 'catalog':catalog();break;case 'product':detail();break;case 'favorites':favPage();break;case 'cart':cartPage();break;default:home()}
    setup();persist();
    // No autoplay: a imagem principal da collab muda apenas sob a escolha explícita do visitante.
  }
  document.addEventListener('DOMContentLoaded',start);
})();
