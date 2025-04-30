# Hevy API usage to automate progressive overlaod

## Local setup

This will require a Hevy Pro account at the time of this module's creation.  The API is locked behind an API Key that is only available to Pro accounts.

## Hevy Setup

In your routines, under the notes you'll need a JSON object with the following structure.  This is because the Hevy API doesn't make adjusting reps based on a rep range easy, nor can you easily tweak the weight adjustment.  In addition the current API doesn't return the rest time on the routines GET route.  Hopefully this becomes less necessary over time.

```JSON
{
    "repRangeMax": 10, 
    "repRangeMin": 8, 
    "rest_seconds": 90,
    "weightIncrement": 5,
}
````

The rep range is used to determine when to bump the weight for an exercise (if you are able to do the max reps, the next routine will bump the current weight by the weight increment).


## Running the script

Just copy the `.env.example` file to a `.env` file, and replace the API key and route with your API key and the current Hevy base route url.  Then run `npm start`.  If you did it right it should pull your last workout, and update the routine with the same name and console log the name of the updated routine.