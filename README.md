# RedSnap
An open-source web-based Snapchat clone. Built with node.js, express.js, angular, mongodb and redis.

*Historically, privacy was almost implicit, because it was hard to find and gather information. But in the digital world, whether it’s digital cameras or satellites or just what you click on, we need to have more explicit rules—not just for governments but for private companies. —Bill Gates*

Works in the latest versions of Edge, Firefox and Chrome (use https to enable webcam). Works to some degree on Android Chrome. Please read the [notice] (https://github.com/gaessaki/RedSnap/blob/master/README.md#notice) before trying the site out. As the app was built as an MVP over the weekend, the code is by no means an indicator of best practices. There are many vulnerabilities that I am aware of in the code and I am sure you will find more (Please contribute fixes if you can). DEMO: https://myhack.ca.

####Why did I build this?

My primary intention was to practice my web development skills as I come from a .NET and Android background. But the more I got into it, the more I saw the importance and the need of an open-source alternative to Snapchat. By no means am I anti-Snapchat (I'll still probably use it every day for the time being), but the incentives are evident:

* As a non-profit open source project, no complicitness in comprimising data to advertisters or the gov't
* Project development not geared towards monetization (e.g. ads, blocking 3rd party clients)
* Clients can be built for any device (Yay Windows Phone! Or perhaps integration with a digital camera, drone, etc.?)
* Users can host private RedSnap servers that only members of their community can join (e.g. family, company, school club)
* Customize your own installation of RedSnap however you want. Change snapping rules, colour schemes, make your own filter, etc.
* An example of a complete node.js/angular project for newbies to learn from

The node.js app can expose its API and thus iOS, Android, Windows Phone, Raspberry Pi, etc. clients are all possible. Please email me at mansib.rahman@outlook.com if you are interested in contributing.

##Notice

As it stands, RedSnap is WIP and thus I can make no guarantee of security, privacy or functionality. Restrain from submitting personally indentifiable information or any data that you would not like compromised (i.e. personal photos) into the system. **Use at your own risk.**

##Installation

Requires a MongoDB anda Redis instance (check out https://compose.io to quickly sping some up). To install, clone the repo and then create a config.js file in the root folder of the application (the one with app.js). Then include the following in the file:

```
module.exports = {
    mongoURL : 'mongodb://[host]:[port]/[DB]',
    mongoOptions : {
        user : '[username]',
        pass : '[password]'
    },
    redisURL: 'redis://x:[password]@[host]:[port]',
    deleteSnaps: true
}
```
As you can image, the ```deleteSnaps``` option determines whether snaps are deleted. If set to false, The user may review any snaps she or he has received repeatedly.

##Program Structure

The app bootstraps from **app.js** which connects to the databases and enables the API routes. All the routes and middlewares are outlined in **routes.js**, also in the same folders. The meat of the API calls are in the controllers folder in the app root. Users are stored in MongoDB, for which the models resides in the models folder. The systems folder contains misc code that is to be reused throughout the backend (passport bootstrapping, redis connection, cron job to delete snaps, etc.)

All the client (i.e. browser) content resides in the public folder. If you're familiar with Angular, the structure should be clear enough. All the html files are stored in view. Each html has a corresponding controller in the public/javascripts/controllers folder. The angular app is bootstrapped in **core.js**, which is in the javascripts folder.

##Contributors

* Mostafa Saadat - Tested app functionality throughout the hacking process
* Afuad Hossain - Discovered bug in friending functionality during use
* Zack Ohlin - Discovered bug in friending functionality during use 

##License

[MIT] (https://github.com/gaessaki/RedSnap/blob/master/LICENSE)
