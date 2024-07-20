/**
 * @component
 * @param {React.SVGProps<SVGSVGElement>} props - The component props.
 * @returns {React.JSX.Element} - The rendered SVG component.
 */
const SvgOpenSearchService = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" {...props}>
    <defs>
      <linearGradient id="a" x1="0%" x2="100%" y1="100%" y2="0%">
        <stop offset="0%" stopColor="#4D27A8" />
        <stop offset="100%" stopColor="#A166FF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="url(#a)" d="M0 0h80v80H0z" />
      <path
        fill="#FFF"
        d="M44.26 51.33c-4.417 0-8.01-3.593-8.01-8.009s3.593-8.01 8.01-8.01 8.01 3.593 8.01 8.01-3.593 8.009-8.01 8.009m0-18.019c-5.52 0-10.01 4.49-10.01 10.01S38.74 53.33 44.26 53.33s10.01-4.49 10.01-10.009-4.49-10.01-10.01-10.01m20.288 28.035a1.774 1.774 0 0 1-2.496.131l-8.34-7.523a14.4 14.4 0 0 0 2.337-2.641l8.367 7.538c.723.652.781 1.773.132 2.495M32.011 43.321c0-6.755 5.495-12.25 12.249-12.25s12.249 5.495 12.249 12.25c0 6.754-5.495 12.249-12.249 12.249s-12.249-5.495-12.249-12.249m25.052 6.214a14.14 14.14 0 0 0 1.446-6.214c0-7.858-6.392-14.25-14.249-14.25s-14.249 6.392-14.249 14.25S36.403 57.57 44.26 57.57c2.899 0 5.596-.875 7.849-2.368l8.605 7.762a3.75 3.75 0 0 0 2.518.962 3.77 3.77 0 0 0 2.802-1.241 3.777 3.777 0 0 0-.278-5.319zM67 20v34h-2V21h-8v11h-2V20a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1M51 61h2v5a1 1 0 0 1-1 1H42a1 1 0 0 1-1-1v-6h2v5h8zm-8-35h-2V14a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14h-2V15h-8zm-6 33h2v7a1 1 0 0 1-1 1H28a1 1 0 0 1-1-1V51h2v14h8zm-8-23h-2V23a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h-2v-3h-8zM15 65h8V31h-8zm9-36H14a1 1 0 0 0-1 1v36a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V30a1 1 0 0 0-1-1"
      />
    </g>
  </svg>
)
export default SvgOpenSearchService