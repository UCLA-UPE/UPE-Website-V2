# UPE-Website-V2
Migrate the website to Mongo + Node + React

## Phase 1 (happening now)

*Implement the testbank and API server.*

The testbank is a React application. With the API server and Mongo, there are 3 things that need to run for the app to work:

1. The UPE Web API server, running on Node.js and Express
2. The API database, running on MongoDB
3. The UPE Testbank React app, running on Node.js (a separate instance of Node.js from the API server)

Inside this repo, the API server and the database live in `/backend`. The testbank lives in `/testbank`.

At a high level, communication is as follows:

`Testbank <- API Server <- MongoDB`

Where `A <- B` denotes that `A` is the client who initiates requests, and `B` is the server who serves them.
This is just a conceptual model. Don't be confused that the API server is the client in the `API Server <- MongoDB` connection.

The testbank never directly connects to MongoDB. All data operations are exposed by the API server.

The `Testbank <- API Server` connection is a Node.js to Node.js connection. 
The testbank uses [axios](https://github.com/axios/axios) to initate requests, and the API server uses [express](https://github.com/expressjs/express) to satisfy them. 
So far, this has worked well.

## Phase 2 (happening later)

*Implement everything else.*

The big idea is to fragment the old website into microservices. Phase 1 implements the testbank and backend microservices. Phase 2 would be to implement the rest. 
As we re-implement more of the old website's features, we can gradually transition these features from the old website to the new microservices.

Since the API server exposes an HTTP REST interface to all of UPE's data (eventually), the idea is that this will make it very easy to develop and iterate on multiple microsevices independently of each other.
Also, things breaking will be isolated to a single microservice.
If we wanted, we could even eventually shard this thing, and make the UPE services unkillable.

Using the same conceptual description as above:

```
Testbank <---------\
Microservice B <-- API Server <- MongoDB
Microservice C <---/ /
Microservice D <----/
...
```

The microservices would interface with the API server's REST API and never touch the MongoDB database directly.

Possible microservices:
* The informational elements of the website, like the nice splash page and officer info. Maybe this could be a hub for the other microservices too.
* UPE email service. I think this used to exist, but somehow it died? It would be useful for our emails to corporate people to look way more official. Also, the secretary could send emails using this address and it'll look nice in my inbox.
* UPE induction service. This already kinda exists as the bit-byte platform, but it's currently a standalone thing, and we don't deal with the induction tutoring stuff. Integrating the bit-byte platform into our suite of microservices would be cool. The biggest amount of work would probably be migrating the thing to use the UPE REST API for all its data instead of interfacing directly with Django models.
* UPE tutoring service. This would be actually amazing. We could have:
  * The tutoring schedule display
  * A form for members to input their tutoring slot preferences
  * An API we can call to automagically transform the tutoring slot preference list into an optimized tutoring schedule and to insert this into the database
  * A tutoring sign-in page for tutors
  * A tutoring slot exchange service for those times people can't make it
  * A tutoring tracking dashboard for the tutoring chairs / bytes
* UPE history service. A nice historical page displaying photos taken by our historians through the ages, integrated with like the Google photos API or something. Have a slideshow page with filters, so we can see pictures with both austin and arpit from april 2019 - may 2019. Whatever, just go nuts. It will be lit.
* UPE treasury service. Provides transparency into our expenses, if we want that kinda thing.
* UPE mentorship service...I'm not sure what this would do.
* The list goes on

Some of these might be more valuable to implement first. There will come a time when we will have to discuss which microservices to actually implement, and to prioritize the more important ones.
