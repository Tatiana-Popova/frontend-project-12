const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  signUp: () => [apiPath, 'signup'].join('/'),
  pages: {
    login: '/login',
    signup: '/signup',
    rootPage: '/',
  }
};

export default routes;
