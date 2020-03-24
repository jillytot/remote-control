# This repo has moved: 
I split up this repo into the following: <br>

Frontend Web Client built in React: [https://github.com/remotv/remo-web-client](https://github.com/remotv/remo-web-client)<br>
Backend Node Server: [https://github.com/remotv/remo-platform-server](https://github.com/remotv/remo-platform-server)<br>


If you want to run just the frontend, you can connect it to the live dev server. 
In clientSettings.js you can: 

```
const localHost = "localhost"; //default
const devServer = "35.185.203.47"; //default

const host = localHost; //If you want to run just the frontend, change this to devServer, instead of localHost
```
Like so: 
```
const host = devServer;
```

Then in termal run: 
```npm run react```


