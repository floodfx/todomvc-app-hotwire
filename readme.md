# Hotwire • [TodoMVC](http://todomvc.com)

## Intro
Hi there. I wanted to learn more about [Hotwire.dev](https://hotwire.dev) so I build this.  It is my first [Hotwire.dev](https://hotwire.dev)-based app so would love any feedback.  It is also my first [TodoMVC](http://todomvc.com) app.  :) It seemed like a small but not-too-small thing to try out...  Hope you learn something.

## What is Hotwire?

> Hotwire is an alternative approach to building modern web applications without using much JavaScript by sending HTML instead of JSON over the wire. This makes for fast first-load pages, keeps template rendering on the server, and allows for a simpler, more productive development experience in any programming language, without sacrificing any of the speed or responsiveness associated with a traditional single-page application.

## Resources

* [Hotwire.dev](https://hotwire.dev)
  * [Turbo](https://turbo.hotwire.dev/)
  * [Stimulus](https://stimulus.hotwire.dev/)

## Run it!
  * `npm i` - install deps
  * `npm run server-dev` - run the server

That's it.  Server runs on [`localhost:3001`](http://localhost:3001)

### Rebuild Client (Stimulus Controllers)
If you change the client code you need to rebuild it
  * `npm run client-build` - rebuild the client js and css (only necessary if you are changing it)

## Implementation

This is my first [Hotwire.dev]-based app so would love any feedback.  The [TodoMVC](http://todomvc.com) App seemed like a small but not-too-small thing to try out...

### Directory Structure
 * `dist` - bundled / compiled js (from `src/client/index`) and css (from `todomvc-*` css)
 * `src`
   * `client/controllers` - Stimulus controllers implementation and code to register the controllers and Turbo
   * `models` - basic `Todo` and `Todos` model implementations
   * `server` - Express server code
   * `views` - Eta templates corresponding to the routes from the server
     * `todo` - todo templates
     * `turbo-streams` - turbo-stream generic templates
     * `todos` - todos templates

#### 

### Tech Used
Thanks to these wonderful folks!
  * [Hotwire Turbo](https://turbo.hotwire.dev/)
    * Specifically - Turbo Frames and Turbo Streams
  * [Hotwire Stimulus](https://stimulus.hotwire.dev/)
  * [ExpressJS](https://expressjs.com/)
  * [Eta](https://eta.js.org/) (Template Engine)
  * [Parcel](https://parceljs.org/) (Bundle Client Controllers)
  * [Nodemon](https://nodemon.io/) (Watcher)



## Credit

Created by [Donnie Flood](https://twitter.com/floodfx)
