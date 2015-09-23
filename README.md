# I shouldn't ask anyone to do something I'm not willing to do.

So Imma build an API.

### Customers
- [ ] Retrive a list of all customers
- Retrive a subset of customers
  - Given a sort column, return _n_ customer records, offset by _p_ records (this will be used to create "pages" of customers)
  - Sort columns are
    - `name`
    - `registered_at`
    - `postal_code`
- Given a customer's `id`...
  - List the movies they _currently_ have checked out
  - List the movies a customer has checked out in the past
    - ordered by check out date
    - includes return date

### Movies
- [x] Retrieve a list of all movies
- [x] Retrieve a subset of movies
  - [x] Given a sort column, return _n_ movie records, offset by _p_ records (this will be used to create "pages" of movies)
  - Sort columns are
    - [x] `title`
    - [x] `release_date`
- Given a movie's `title`...
  - Get a list of customers that have _currently_ checked out a copy of the film
  - Get a list of customers that have checked out a copy _in the past_
    - ordered by customer `id`
    - ordered by customer `name`
    - ordered by check out date

### Rental
- Look a movie up by title to see
  - it's synopsis
  - release date
  - and inventory total
- Know if a movie has any inventory available to rent
- See a list of customers that have _currently_ checked out any of the movie's inventory
- Given a customer's `id` and a movie's `title` ...
  - "check out" one of the movie's inventory to the customer
    - Establish a return date
    - Charge the customer's account (cost up to you)
  - "check in" one of customer's rentals
    - return the movie to its inventory
- See a list of customers with overdue movies

