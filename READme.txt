Weather app using google localization, google maps and draxis API.

The user can click on the map (north Greece) to place the marker on the geographic coordinates of his preference 
and select the resolution and the meteorological variable for which he wants to receive a 24h weather forcast.
The forecast data is displayed in a table.
In case of hourly data (such as Temperatures) each hour of the day is represented by one row registration.
A pagination is also used to limit table row registrations to up to 4 per page.
Table headers can also be used for sorting the data in ascending or descending order.
Last but not least, the data can also be displayed in a line chart upon clicking the "Show Chart" button.

This project is using JavaScript, jQuery, Bootstrap, CSS, HTLM and Chart.js
CORS limitations were bypassed by calling endpoints via RobWu's server 
https://github.com/Rob--W/cors-anywhere