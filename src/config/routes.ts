export enum SEB_ROUTES {
  REDIRECT_LOGIN='https://api-sandbox.sebgroup.com/mga/sps/oauth/oauth20/authorize',
  AUTHORIZATIONS = 'https://api-sandbox.sebgroup.com/auth/v3/authorizations',
  LOGIN = 'https://api-sandbox.sebgroup.com/open/sb/auth/mock/v1/login',
  TOKENS = 'https://api-sandbox.sebgroup.com/auth/v3/tokens',
  ACCOUNTS = 'https://api-sandbox.sebgroup.com/ais/v7/identified2/accounts',
  PAYMENT_INITIATION = 'https://api-sandbox.sebgroup.com/pis/v8/identified2/payments/',
  PAYMENT_AUTHENTICATION_BASE_URL = 'https://api.sbx.sebgroup.com/pis/v8/identified2/payments/',
  FX_RATES = 'https://api.sbx.sebgroup.com/open/fxrates/v3/fx-spot-exchange-rate?unit_currency=',
  FX_TRANSFER_QUOTES = 'https://api.sbx.sebgroup.com/cvp/fx-currency-exchange-service/v1/quotes',
  TRANSFER_PING = 'https://api.sbx.sebgroup.com/cvp/fx-currency-exchange-service/v1/ping',
  TOKEN = 'https://api-sandbox.sebgroup.com/mga/sps/oauth/oauth20/token',
}