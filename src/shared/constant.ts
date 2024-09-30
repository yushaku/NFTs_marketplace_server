import 'dotenv/config'

export const KEYS = {
  CURRENT_BLOCK: 'CURRENT_BLOCK',
}

export enum QUEUE_LIST {
  AUTH = 'AUTH',
  CONTRACT = 'CONTRACT',
}

export const LOGIN_MESSAGE =
  'Welcome to Yushaku! Please sign this message to verify account ownership.'

export enum TOKEN {
  REFRESH = 'refresh_token',
  ACCESS = 'access_token',
}

export const RPC = {
  56: {
    name: 'bsc',
    chainId: 56,
    rpcUrls: process.env.PRIVATE_RPC || 'https://bsc-dataseed1.binance.org/',
    shopPayment: '',
  },
  97: {
    name: 'bsc testnet',
    chainId: 97,
    rpcUrls:
      process.env.PRIVATE_RPC ||
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
    shopPayment: '0x4E3DdcCeEf165fC30F876cf81b4d7a80C2A1A7bD',
  },
} as const

// prettier-ignore
export const TOPICS = {
  ORDER_PAID: '0x48da3edde46115c63addf11fd46fbab76bbb24d17301d4befd6a8311e3c5dc49',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
}

export const JOB_LIST = {
  ORDER_PAID: 'ORDER_PAID',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
}

export const HttpCodeMessages = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Content Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  421: 'Misdirected Request',
  422: 'Unprocessable Content',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable for Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
}
