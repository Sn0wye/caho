import { cn } from '@/utils/cn';

interface RoomsFormsProps {
  className?: string;
}

export function RoomsForms({ className }: RoomsFormsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 276 267"
      className={cn('h-full', className)}
    >
      <path
        fill="currentColor"
        className='text-secondary-foreground opacity-10'
        d="M143.129 196.345a1.466 1.466 0 000-2.934h-3.862v-3.741a1.466 1.466 0 10-2.933 0v3.742h-3.861a1.466 1.466 0 100 2.933h10.656zM136.334 163.631v10.415a1.467 1.467 0 002.933 0v-10.415a1.466 1.466 0 10-2.933 0zM136.334 142.799v5.208a1.466 1.466 0 002.933 0v-5.208h-2.933zM116.488 196.345a1.467 1.467 0 000-2.933h-10.656a1.466 1.466 0 100 2.933h10.656zM89.848 196.345a1.467 1.467 0 000-2.933H79.19a1.466 1.466 0 100 2.933h10.657zM63.207 196.345a1.467 1.467 0 000-2.933H52.55a1.466 1.466 0 100 2.933h10.656zM36.566 196.345a1.467 1.467 0 000-2.933h-6.795v6.628a1.467 1.467 0 102.934 0v-3.695h3.861zM32.705 215.526a1.467 1.467 0 10-2.933 0v10.324a1.466 1.466 0 002.933 0v-10.324zM32.705 241.336a1.467 1.467 0 10-2.933 0v5.162h2.933v-5.162zM136.334 177.899a1.466 1.466 0 112.933 0v3.396a1.467 1.467 0 01-2.933 0v-3.396zM159.113 196.345a1.466 1.466 0 010-2.934h10.656a1.467 1.467 0 010 2.934h-10.656zM185.754 196.345a1.467 1.467 0 010-2.934h10.656a1.467 1.467 0 010 2.934h-10.656zM212.395 196.345a1.467 1.467 0 010-2.934h10.656a1.466 1.466 0 010 2.934h-10.656zM239.035 196.345a1.466 1.466 0 010-2.934h6.795v6.629a1.467 1.467 0 01-2.933 0v-3.695h-3.862zM242.897 215.526a1.466 1.466 0 112.933 0v10.324a1.466 1.466 0 01-2.933 0v-10.324zM242.897 241.336a1.466 1.466 0 112.933 0v5.161a1.467 1.467 0 01-2.933 0v-5.161z"
      ></path>
      <path
        fill='currentColor'
        className='text-primary-foreground'
        d="M0 0H52.797V52.797H0z"
        transform="translate(4.34 213.689)"
      ></path>
      {/* Inside icon - */}
      <path
        stroke="currentColor"
        className='text-primary'
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.444"
        d="M22.185 240.088h17.109M30.74 231.533v17.109"
      ></path>
      {/* Lock box */}
      <path
        fill='currentColor'
        className='text-primary-foreground'
        d="M0 0H52.797V52.797H0z"
        transform="translate(111.402 213.689)"
      ></path>
      <path
        stroke="currentColor"
        className='text-primary'
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.444"
        d="M146.355 238.866h-17.109a2.444 2.444 0 00-2.444 2.444v8.554a2.445 2.445 0 002.444 2.445h17.109a2.445 2.445 0 002.444-2.445v-8.554a2.444 2.444 0 00-2.444-2.444zM131.69 238.866v-4.888a6.11 6.11 0 0112.221 0v4.888"
      ></path>
      <path
        fill='currentColor'
        className='text-primary-foreground'
        d="M0 0H52.797V52.797H0z"
        transform="translate(218.463 213.689)"
      ></path>
      <path
        stroke="currentColor"
        className='text-primary'
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.444"
        d="M243.639 248.642c5.4 0 9.777-4.377 9.777-9.776 0-5.4-4.377-9.777-9.777-9.777-5.399 0-9.776 4.377-9.776 9.777 0 5.399 4.377 9.776 9.776 9.776zM255.86 251.087l-5.255-5.255"
      ></path>
      <path
        fill='currentColor'
        className='text-primary-foreground'
        d="M2.469 3.304H273.132V175.421H2.469z"></path>
      <path
        fill='currentColor'
        className='text-input opacity-50'
        d="M20.949 19.577H254.65200000000002V43.737H20.949z"
      ></path>
      <path
        fill='currentColor'
        className='text-input opacity-50'
        d="M20.949 58.047H254.65200000000002V82.207H20.949z"
      ></path>
      <path
        fill='currentColor'
        className='text-input opacity-50'
        d="M20.949 96.518H254.65200000000002V120.678H20.949z"
      ></path>
      <path
        fill="currentColor"
        className="text-primary"
        d="M20.949 134.988H254.65200000000002V159.148H20.949z"
      ></path>
      <path
        stroke="currentColor"
        className='text-border'
        strokeWidth="4.661"
        d="M2.469 3.304H273.132V175.421H2.469z"
      ></path>
    </svg>
  );
}
