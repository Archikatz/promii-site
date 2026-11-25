/* Promii home path groups for burst/orbit */
(function(){
  var PATH_MAP=[
    {g:{es:'Portafolio',en:'Portfolio'},c:'#2f6bff',items:[
      {t:{es:'Inicio',en:'Home'},d:{es:'Landing y vitrina',en:'Landing & showcase'},href:'/',st:'live',sat:1},
      {t:{es:'About',en:'About'},d:{es:'Servicios y perfil',en:'Services & profile'},href:'/about/',st:'live'},
      {t:{es:'Contacto',en:'Contact'},d:{es:'Escr\u00edbeme',en:'Get in touch'},href:'/#contacto',st:'live'}
    ]},
    {g:{es:'Editorial',en:'Editorial'},c:'#E8B23A',items:[
      {t:{es:'Editorial',en:'Editorial'},d:{es:'Fractalia \u00b7 Sicodelia \u00b7 toons',en:'Fractalia \u00b7 Sicodelia \u00b7 toons'},href:'/editorial/',st:'live',sat:1},
      {t:{es:'Blog',en:'Blog'},d:{es:'Bit\u00e1cora y casos',en:'Journal & cases'},href:'/blog/',st:'live'}
    ]},
    {g:{es:'Arcade',en:'Arcade'},c:'#22E0C8',items:[
      {t:{es:'Arcade',en:'Arcade'},d:{es:'20 protocolos',en:'20 protocols'},href:'/arcade/',st:'live',sat:1},
      {t:{es:'Games hub',en:'Games hub'},d:{es:'Lanzar protocolos',en:'Launch protocols'},href:'/games/',st:'live'}
    ]},
    {g:{es:'Academy & Lab',en:'Academy & Lab'},c:'#6E9BFF',items:[
      {t:{es:'Academy',en:'Academy'},d:{es:'IA-01 y escuelas',en:'IA-01 & schools'},href:'/academy/',st:'live',sat:1},
      {t:{es:'Lab',en:'Lab'},d:{es:'Prototipos y motion',en:'Prototypes & motion'},href:'/lab/',st:'live'}
    ]},
    {g:{es:'Espacios',en:'Spaces'},c:'#10A37F',items:[
      {t:{es:'ACOI',en:'ACOI'},d:{es:'Caso / maqueta 2027',en:'Case / 2027 mock'},href:'/acoi/',st:'live',sat:1},
      {t:{es:'Privacidad',en:'Privacy'},d:{es:'Datos y control',en:'Data & control'},href:'/privacy/',st:'live'}
    ]}
  ];
  window.PROMII_PATH_MAP = PATH_MAP;
  window.PROMII_SITE = window.PROMII_SITE || {};
  if (!window.PROMII_SITE.map || !window.PROMII_SITE.map.length) {
    window.PROMII_SITE.map = PATH_MAP;
  }
})();
