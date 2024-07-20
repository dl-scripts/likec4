/**
 * @component
 * @param {React.SVGProps<SVGSVGElement>} props - The component props.
 * @returns {React.JSX.Element} - The rendered SVG component.
 */
const SvgFSxForWfs = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" {...props}>
    <defs>
      <linearGradient id="a" x1="0%" x2="100%" y1="100%" y2="0%">
        <stop offset="0%" stopColor="#1B660F" />
        <stop offset="100%" stopColor="#6CAE3E" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="url(#a)" d="M0 0h80v80H0z" />
      <path
        fill="#FFF"
        d="M53 52h13.001v-1H53zm1-3h11v-7H54zm14 1v2c0 1.103-.897 2-2 2H53c-1.103 0-2-.897-2-2v-2a1 1 0 0 1 1-1v-8a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v8a1 1 0 0 1 1 1M54.413 30.675h-2.469l-4.724 6.994-1.265 1.816L50 45.494v-3.869l-1.564-2.309zM39.333 49h2.504l4.177-6.326-1.129-1.652zm6.838-12.883-3.677-5.442h-2.605l4.966 7.26zm-11.344 1.429L31.5 36.224q-1.65-.645-2.535-1.21-.886-.564-1.276-1.258-.388-.693-.388-1.822 0-1.999 1.275-3.08t3.67-1.08q2.457 0 5.629 1.161V27.29a14.4 14.4 0 0 0-2.846-.951A13 13 0 0 0 32.152 26q-3.015 0-4.867 1.661-1.85 1.661-1.849 4.338 0 1.967 1.119 3.305 1.12 1.339 3.514 2.306l3.608 1.452q1.865.741 2.705 1.676.84.936.84 2.258 0 2.161-1.539 3.419-1.54 1.257-4.121 1.257-2.738 0-6.002-1.225v1.645q2.705 1.354 6.157 1.354 3.328 0 5.365-1.774 2.036-1.773 2.037-4.644 0-1.967-1.026-3.273t-3.266-2.209M12 26.548h12.098v1.709H13.835v8.547h8.677v1.709h-8.677v10.385H12z"
      />
    </g>
  </svg>
)
export default SvgFSxForWfs