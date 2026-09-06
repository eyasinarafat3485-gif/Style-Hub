/**
 * Trigger Real Google OAuth 2.0 Popup & Account Selector
 */
export const triggerGoogleSignIn = () => {
  return new Promise((resolve, reject) => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '152298410506-0j4ltekdkpcnna763tjt9s63oc1sh4v9.apps.googleusercontent.com';

    // Helper to request token via Google Identity Services (GSI)
    const requestGoogleToken = () => {
      if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        return reject(
          new Error('Google Identity Services script is not loaded. Please check your internet connection.')
        );
      }

      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              return reject(new Error(tokenResponse.error_description || tokenResponse.error));
            }

            if (!tokenResponse.access_token) {
              return reject(new Error('Failed to retrieve access token from Google.'));
            }

            try {
              // Fetch user profile from official Google userinfo endpoint
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!userInfoRes.ok) {
                throw new Error('Failed to fetch user details from Google.');
              }

              const userInfo = await userInfoRes.json();
              resolve({
                credential: null,
                userInfo: {
                  email: userInfo.email,
                  name: userInfo.name,
                  picture: userInfo.picture,
                  sub: userInfo.sub,
                },
              });
            } catch (fetchErr) {
              reject(fetchErr);
            }
          },
        });

        // Open Google account selection popup
        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (initErr) {
        reject(initErr);
      }
    };

    // If script is already loaded
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      requestGoogleToken();
    } else {
      // Dynamic load fallback
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(requestGoogleToken, 100);
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In library.'));
      };
      document.head.appendChild(script);
    }
  });
};
