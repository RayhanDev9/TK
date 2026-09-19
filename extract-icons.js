const fs = require('fs');
const path = require('path');
const fa6 = require('react-icons/fa6');
const hi2 = require('react-icons/hi2');
const io5 = require('react-icons/io5');
const bs = require('react-icons/bs');
const tb = require('react-icons/tb');

// Helper to render react-icons tree into SVG string
function renderTree(node) {
  if (!node) return '';
  const { type, props } = node;
  if (!type || !props) return '';

  let attrs = '';
  for (const [key, value] of Object.entries(props)) {
    if (key !== 'children' && key !== 'key' && typeof value !== 'object') {
      attrs += ` ${key}="${value}"`;
    }
  }

  const childrenStr = props.children && Array.isArray(props.children)
    ? props.children.map(renderTree).join('')
    : (props.children ? renderTree(props.children) : '');

  return `<${type}${attrs}>${childrenStr}</${type}>`;
}

function iconToSvg(iconFn, options = {}) {
  const elem = iconFn(options);
  const viewBox = elem.props.attr ? elem.props.attr.viewBox : '0 0 512 512';
  const className = options.className || 'w-5 h-5';
  const fill = options.fill || 'currentColor';
  const stroke = options.stroke || 'none';

  const innerContent = (elem.props.children || []).map(renderTree).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${fill}" class="${className}" aria-hidden="true">${innerContent}</svg>`;
}

const ICONS = {
  // Islamic & Character
  FaMosque: fa6.FaMosque,
  FaHandsHoldingChild: fa6.FaHandsHoldingChild,
  FaHeart: fa6.FaHeart,
  FaShieldHeart: fa6.FaShieldHeart,
  FaShieldHalved: fa6.FaShieldHalved,
  FaPalette: fa6.FaPalette,
  FaShapes: fa6.FaShapes,
  FaGraduationCap: fa6.FaGraduationCap,
  FaSchool: fa6.FaSchool,
  FaBookOpen: fa6.FaBookOpen,
  FaChild: fa6.FaChild,
  FaChildren: fa6.FaChildren,
  FaBaby: fa6.FaBaby,
  FaStar: fa6.FaStar,
  FaPhone: fa6.FaPhone,
  FaEnvelope: fa6.FaEnvelope,
  FaLocationDot: fa6.FaLocationDot,
  FaWhatsapp: fa6.FaWhatsapp,
  FaTiktok: fa6.FaTiktok,
  FaFilePdf: fa6.FaFilePdf,
  FaDownload: fa6.FaDownload,
  FaPlay: fa6.FaPlay,
  FaPause: fa6.FaPause,
  FaExpand: fa6.FaExpand,
  FaChevronDown: fa6.FaChevronDown,
  FaChevronLeft: fa6.FaChevronLeft,
  FaChevronRight: fa6.FaChevronRight,
  FaXmark: fa6.FaXmark,
  FaCircleCheck: fa6.FaCircleCheck,
  FaQuoteLeft: fa6.FaQuoteLeft,
  FaComments: fa6.FaComments,
  FaSparkles: fa6.FaWandMagicSparkles,
  FaClock: fa6.FaClock,
  FaAward: fa6.FaAward,
  FaTree: fa6.FaTree,
  FaPuzzlePiece: fa6.FaPuzzlePiece,
  FaPaperPlane: fa6.FaPaperPlane
};

// Export SVGs to asset/svg/react-icons directory for easy access
const outDir = path.join(__dirname, 'asset', 'svg', 'react-icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating react-icons SVGs:');
for (const [name, fn] of Object.entries(ICONS)) {
  if (fn) {
    const svgStr = iconToSvg(fn, { className: 'w-full h-full' });
    fs.writeFileSync(path.join(outDir, `${name}.svg`), svgStr);
    console.log(` - ${name}.svg`);
  } else {
    console.warn(` - Warning: ${name} not found`);
  }
}

console.log(`\nSuccessfully generated ${Object.keys(ICONS).length} react-icons in ${outDir}`);
