## Terms

**Portal** - the application which will host all the other applications. All applications are displayed within the portal through an iframe

**Micro-frontend** - applications once they are registered with the Portal, a user can navigate to it through the Portal. Commonly referred to as MFE

**Portal Utility library** - library to help MFEs with common functionality to more easily integrate with the Portal. All utilities are written for ReactJS, but some examples may be provided in javascript

**MSAL** - Microsoft authentication library. All applications need to use Azure AD as the authentication source.

**BFF** - backend for front end. Application specific APIs. These should be secured using the MSAL library and scoped appropriately

## Register Your Application

You will need to open a JIRA ticket assigned to a member of the Luminate Portal Team requesting your application to be registered with the Portal with the following information:

1.  App display name
2.  App namespace - this has to be unique and will reflect in the URL. (i.e. portal.jda.com/namespace)

After the registration is processed, you will receive your application ID. This will be used to update your application configuration. Below are all the configurations:

1.  displayName - name displayed on the portal menu
2.  headerName - name displayed on the portal header when the app is active
3.  icon - icon shown on the portal menu
4.  iconColor - icon color of the icon shown in portal menu (hex)
5.  frameUrl - the url of the application. Do not provide a trailing slash, unless it is needed for navigation. [See more](#Deep-linking-within-your-app)
6.  scopes - BFF scopes provided as an array of strings.
7.  enabled - by default all new apps are disabled. When you are ready for your app to show in the portal, change this to true

## Updating your app config

TBD

## Starting Local Development

1.  Clone the [portal](https://github.com/JDA-Product-Development/plat-lui-portal.git)
2.  Open mock/mfe/apps/#/GET/mock/success.json and add your application ID you received during the registration process
3.  Set your frameUrl to your local app url (or any url you need to develop against)
4.  Run npm install and start:local

## Configuring your MFE app to communicate with the portal

A good example to get your app started for portal dev is available at https://github.com/JDA-Product-Development/plat-lui-portal-react-poc

# Configuring a new app

Add the following optional dependencies:

| Package                           | Library Description                                      |
| --------------------------------- | -------------------------------------------------------- |
| @jda/lui-common-component-library | Component library                                        |
| @jda/lui-portal-utilities         | Utility library to make communication easier with portal |
| msal                              | auth library to make your app run standalone             |
| react-aad-msal                    | wrapper for auth library for react components            |

The rest of this document will assume you installed all the dependencies above, even though they are optional. They are optional because you can write all the functionality on your own if you need more customization.

## Authentication

There are two ways to run the app. The first is in the portal. The other way is to run it as a standalone app. Consider using this in your app:

```
// checks if the app is running inside the portal iframe
if (window.parent !== window) {
	ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
} else {
	ReactDOM.render( <AzureAD provider={authProvider} forceLogin={true}><Router><App /></Router></AzureAD>, document.getElementById('root'));
}
```

You can just as easily restrict the MFE from running outside the Portal i.e.:

```
// checks if the app is running inside the portal iframe
if (window.parent !== window) {
	ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
} else {
	alert(“You cannot run the app”)
}
```

## Getting tokens for API calls example:

```
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getMSALTokenFromPortal } from '@jda/lui-portal-utilities'

const ORDERS_URL = "https://luminate-ui-portal-poc-bff-api-c.azurewebsites.net/api/v1/orders";

export const useOrders = () => {
	const [orders, setOrders] = useState<any[] | undefined>(undefined);
	useEffect(() => {
		const runEffect = async () => {
		const scopes =  ['https://blueyonderinteroptestus.onmicrosoft.com/5c1363de-fad6-4b80-ab71-7d2e24bfc66a/access']
		const token = await getMSALTokenFromPortal(scopes, process.env.REACT_APP_PORTAL_HOST);
		try {
			const request = axios.create({
				headers: {
					'Authorization' : `Bearer ${token.accessToken}`
				}
			});
			const result = await request.get(ORDERS_URL);
			console.log(result);
			setOrders(result.data);
		} catch (err) {
			console.error(err)
		}
	}
	runEffect();
	}, [setOrders]);
	return orders;
};
```

Note that it is important to send in the REACT_APP_PORTAL_HOST otherwise a default value will be used. This ensures the message is sent to the correct origin. Meaning that if your portal is running on localhost:3000, then you need to send http://localhost:3000 to the second parameter, otherwise the message will be ignored.

## There is a similar way to retrieve the token yourself using the MSAL library:

[See full code usage](src/hooks/useOrders.tsx)

```
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getMSALToken } from '@jda/lui-portal-utilities'
import authenticationParameters from '../auth/authenticationParameters';
import authProvider from '../auth/authProvider';

const ORDERS_URL = "https://luminate-ui-portal-poc-bff-api-c.azurewebsites.net/api/v1/orders";
export const useOrders = () => {

    const [orders, setOrders] = useState<any[] | undefined>(undefined);
    useEffect(() => {
        const runEffect = async () => {
        const scopes = authenticationParameters.scopes
        const token = await getMSALToken(scopes, (scopes: string[]) => { return authProvider.getAccessToken();});
        try {
            const request = axios.create({
                headers: {
                    'Authorization' : `Bearer ${token.accessToken}`
                }

            });

            const result = await request.get(ORDERS_URL);
            console.log(result);
            setOrders(result.data);
        } catch (err) {
            console.error(err)
        }
    }

    runEffect();

}, [setOrders]);



return orders;

};
```

## Deep linking within your app

[See full code usage](src/App.tsx)

Your app can navigate as normal, but you need to let the portal know that navigation has occurred within your app. The portal will update the url in the browser and the browser will know how to handle history gracefully (even on reloads).

On reloads or link sharing, the portal will load the frameUrl+path. If your frameUrl is defined as https://transport.jda.com/ and the route sent to the portal is /route2. The portal will try to load https://transport.jda.com//route2. To avoid the double slash, make sure you don’t include the trailing slash on frameUrl when you register or update your app.

Here is how to use the `useDomHistoryMonitor` utility to help with this when using react-router-dom:

```
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { useDomHistoryMonitor } from '@jda/lui-portal-utilities';

const App: React.FC = () => {
    const classes = useStyles();
    useDomHistoryMonitor();

    return (
        <div className="app">
            <Route path="/" render={({ location }) => (
                <Fragment>
                    <Tabs value={location.pathname} className={classes.tabsRoot} >
                        <Tab label="Home" value="/" to="/" component={Link} />
                        <Tab label="Orders" value="/orders" to="/orders" component={Link} />
                    </Tabs>
                    <Switch>
                        <Route path="/orders" component={Orders}></Route>
                        <Route path="/" component={Home}></Route>
                    </Switch>
                </Fragment>
        </div>
    );
}

export default withRouter(App);
```

## Deep linking to another app in the portal

[See full code usage](src/components/Orders.tsx)

When you link to another app, you will need to message the portal. You can publish routes as part of your API, but keep in mind to keep all endpoints perpetual.

Example:

```
import { AppNavigationDeepLink, PortalMessageService } from '@jda/lui-portal-utilities';

const message = new AppNavigationDeepLink(‘someApp’, `/products/398765`);
PortalMessageService.getInstance().sendMessageToPortal(message, process.env.REACT_APP_PORTAL_HOST);
```

## Displaying a Modal

tbd

# Existing Apps

If you already have an app that needs to integrate into the portal you will most likely need to use the token fetching capability. You will use the token to make authenticated calls to your BFF as a bearer token.

Here is an example implementation of a token service

```
import defer from 'defer-promise'

export class TokenService {
  private defers = {};
  private messageId = 0;

  constructor() {
    window.addEventListener("message", this.resolveToken.bind(this));
  }

  public getToken(scopes): Promise<any> {
    const message = { action: "get:token", scopes, messageId: this.getMessageId() };
    window.parent.postMessage(message, environment.parentApp);
    setTimeout(() => { this.handleRejectTimeout(message.messageId) }, 6000)
    this.defers[message.messageId] = defer();
    return this.defers[message.messageId].promise;
  }

  private getMessageId() {
    return ++this.messageId;
  }

  private handleRejectTimeout(messageId) {
    if (this.defers[messageId]) {
      this.defers[messageId].reject("Token request timed out");
    }
  }

  private resolveToken(message: MessageEvent) {
    const data = message.data;
    if (data.action === 'return:token' && this.defers[data.messageId] && message.origin === environment.parentApp) {
      if (data.status === 200) {
        this.defers[data.messageId].resolve(data.token);
      } else {
        this.defers[data.messageId].reject("Unable to get token with specified scope");
      }
      delete this.defers[data.messageId];
    }
  }

}
```

If you have routing, you will also need to let the portal know of any changes to the route so that deep linking can work gracefully. The routing call is a "fire and forget" type of call to the portal. Here is a sample implementation:

```
window.onpopstate = (event: WindowEvent) {
    const message = { action: 'navigate:app:occurred', url: window.document.location.pathname };
    window.parent.postMessage(message, environment.parentApp);
}
```

# XSS Security Mitigation

Since the app is hosted in an iframe, there are certain measures you should take to avoid cross site scripting vulnerabilities. For your static contents, you should set additional CSP headers on your server or CDN provider.

Example headers: `Content-Security-Policy: "frame-ancestors https://portal.jda.com:443"`

The URL would vary per environment

If you are using the browser API `postMessage`, and not the utility library, make sure to include the targetOrigin parameter and not use the wildcard(`*`).

This method prevents hosting of MFE in an unknown domain

The portal will also include headers to allow hosting of all known MFEs. The portal will also not allow itself to be hosted in another iframe.
