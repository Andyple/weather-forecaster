# TEAM WORK PLAN - WEATHER FORECAST APPLICATION
**Assignment 2: Analysis** | Due October 16, 2026, 11:59 PM  
**Team members in this document:** Amika Hanson, Nghia (Brian) Do, Andy Le, Brian Contreras.

---

## 1. Class Diagram

The Weather Forecast Application is modeled using three object-oriented class categories: **entity classes** store domain data, **boundary classes** support user interactions, and **control classes** coordinate application operations. The following is a proposed analysis model based on the group's weather application plan. Confirm it against the use cases in Assignment 1.

### UML Class Diagram Breakdown

#### Boundary Classes (User Interfaces)
* **`<<Boundary>> WeatherSearchUI`**
  * **Attributes:**
    * `- searchQuery: String`
    * `- searchResults: List<Location>`
  * **Operations:**
    * `+ enterLocation(query: String): void`
    * `+ displayResults(locations: List<Location>): void`
    * `+ selectLocation(location: Location): void`
  * **Relationships:** `<<uses>>` `LocationController`

* **`<<Boundary>> ForecastDisplayUI`**
  * **Attributes:**
    * `- selectedLocation: Location`
    * `- forecast: WeatherForecast`
    * `- forecastList: List<WeatherForecast>`
  * **Operations:**
    * `+ displayCurrentWeather(): void`
    * `+ displayForecast(): void`
    * `+ displayError(message: String): void`
  * **Relationships:** `<<uses>>` `ForecastController`

* **`<<Boundary>> AlertSettingsUI`**
  * **Attributes:**
    * `- selectedLocation: Location`
    * `- alerts: List<WeatherAlert>`
  * **Operations:**
    * `+ setAlert(type: String, threshold: Double): void`
    * `+ removeAlert(alertId: int): void`
    * `+ displayAlerts(): void`
  * **Relationships:** `<<uses>>` `AlertController`

#### Control Classes (Application Logic)
* **`<<Control>> LocationController`**
  * **Attributes:**
    * `- locationService: WeatherDataService`
    * `- savedLocationDAO: SavedLocation`
  * **Operations:**
    * `+ searchLocation(query: String): List<Location>`
    * `+ addSavedLocation(user: User, location: Location): void`
    * `+ removeSavedLocation(user: User, location: Location): void`
  * **Relationships:** Association `1` to `0..*` with `User`

* **`<<Control>> ForecastController`**
  * **Attributes:**
    * `- weatherService: WeatherDataService`
  * **Operations:**
    * `+ getCurrentWeather(location: Location): WeatherForecast`
    * `+ getForecast(location: Location, days: int): List<WeatherForecast>`
  * **Relationships:** `<<uses>>` `Location`

* **`<<Control>> AlertController`**
  * **Attributes:**
    * `- alertService: WeatherDataService`
    * `- alertList: List<WeatherAlert>`
  * **Operations:**
    * `+ createAlert(user: User, location: Location, type: String, threshold: Double): WeatherAlert`
    * `+ removeAlert(alertId: int): void`
    * `+ getUserAlerts(user: User): List<WeatherAlert>`
  * **Relationships:** Association `1` to `0..*` with `WeatherAlert`

* **`<<Control>> WeatherDataService`**
  * **Attributes:**
    * `- apiKey: String`
    * `- apiBaseUrl: String`
  * **Operations:**
    * `+ getCurrentWeather(location: Location): WeatherForecast`
    * `+ getForecast(location: Location, days: int): List<WeatherForecast>`
    * `+ searchLocation(query: String): List<Location>`

#### Entity Classes (Data)
* **`<<Entity>> User`**
  * **Attributes:**
    * `- userId: int`
    * `- name: String`
    * `- email: String`
    * `- passwordHash: String`
  * **Operations:**
    * `+ getSavedLocations(): List<SavedLocation>`
    * `+ getAlerts(): List<WeatherAlert>`
  * **Relationships:**
    * Directed Association `1` to `0..*` with `SavedLocation`
    * Directed Association `1` to `0..*` with `WeatherAlert`

* **`<<Entity>> SavedLocation`**
  * **Attributes:**
    * `- savedLocationId: int`
    * `- user: User`
    * `- location: Location`
    * `- nickname: String`
    * `- dateAdded: Date`
  * **Relationships:**
    * Directed Association `0..*` to `1` with `Location`

* **`<<Entity>> Location`**
  * **Attributes:**
    * `- locationId: int`
    * `- name: String`
    * `- latitude: Double`
    * `- longitude: Double`
    * `- country: String`
    * `- state: String`
  * **Relationships:**
    * Directed Association `1` to `0..*` with `WeatherForecast`
    * Directed Association `1` to `1..*` with `WeatherAlert`

* **`<<Entity>> WeatherAlert`**
  * **Attributes:**
    * `- alertId: int`
    * `- user: User`
    * `- location: Location`
    * `- alertType: String`
    * `- thresholdValue: Double`
    * `- isActive: Boolean`
    * `- createdDate: Date`

* **`<<Entity>> WeatherForecast`**
  * **Attributes:**
    * `- forecastId: int`
    * `- location: Location`
    * `- forecastDate: Date`
    * `- temperatureHigh: Double`
    * `- temperatureLow: Double`
    * `- condition: String`
    * `- humidity: Double`
    * `- windSpeed: Double`
    * `- precipitationChance: Double`

### Design Rationale
Entity classes represent data independently from screens. Boundary classes collect input and present output. Control classes coordinate use cases and interactions with an external weather provider. `WeatherDataService` is an application-side integration component, not the external provider itself. Use the same class names in the team's sequence diagrams.

### Diagram and Review Note
The required final UML figure must visually show all 13 classes, their stereotypes, attributes, and the listed associations. This textual specification does not substitute for that figure. Check the original Assignment 1 use cases before final submission: natural-language questions, storm tracking, sunset details, historical exports, and automatic updates may require additional classes or operations.

---

## 2. Statechart

This statechart models how the Weather Forecast Application behaves from the user's side, including errors and recovery. It is split into three figures so each stays readable:
* **Figure 1:** Covers search, GPS location, the forecast and tracking views, and API failures.
* **Figure 2:** Covers login, saved locations, and alert settings (the Managing Profile state in Figure 1).
* **Figure 3:** Covers the background `AlertService`, which runs concurrently with the user session.

State names match the class and term names used elsewhere in this document, for example `WeatherDataService`, `UserAccount`, and `UserProfile`. The use-case numbers (UC1 to UC7) refer to the use-case realizations in Section 3.

### Scope
The chart covers UC1 to UC4 and UC6, plus the GPS lookup and login from Assignment 1. Natural-language questions (UC5), historical data (UC7), and climate data export are not modeled here.

---

## 3. Use-Case Realization

### Use Case 1: Search Weather by Zip Code
* **Actors:** User, Weather API
* **Precondition:** App is open, and the device is online.
* **Trigger:** User submits zip code in search bar.
* **Main Flow:**
  1. User enters a zip code.
  2. System does input validation on input and looks up coordinates.
  3. System requests current weather for given zip code from API.
  4. API returns temp, precipitation, humidity, and UV Index.
  5. Data is stored in system with a timestamp.
  6. Conditions are displayed to user in the user's preferred units and time zone.
* **Errors:**
  * Given an invalid zip code, the user is shown an error and is asked to enter another one.
  * If API is unavailable: Show last saved data for zip, or output "Weather Unavailable" message.
* **Sequence Diagram Flow:**
  ```mermaid
  sequenceDiagram
      actor User
      participant AppUI as App UI
      participant WeatherService as Weather Service
      participant WeatherAPI as Weather API
      participant Database

      User->>AppUI: enter ZIP
      AppUI->>WeatherService: getWeather(zip)
      alt invalid ZIP
          WeatherService-->>AppUI: error
          AppUI-->>User: show error
      else valid
          WeatherService->>WeatherAPI: requestWeather(zip)
          alt API ok
              WeatherAPI-->>WeatherService: weather data
              WeatherService->>Database: store(data, timestamp)
          else API fails
              WeatherService->>Database: getLatest(zip)
              Database-->>WeatherService: old data
          end
          WeatherService-->>AppUI: data + timestamp
          AppUI-->>User: display conditions
      end
  ```
* **Postconditions:** User sees current conditions for that ZIP; data is stored with source and timestamp.

---

### Use Case 2: Viewing Hourly Forecast
* **Actors:** User, External Weather API
* **Preconditions:** An active location is set.
* **Trigger:** User opens the detailed tracking tab.
* **Main Flow:**
  1. User opens the tracking tab.
  2. System requests hourly precipitation and sunrise/sunset data for the location.
  3. System gets the data from the API (or recently saved data) and stores it with a timestamp.
  4. System displays an hourly timeline with sun markers in the user's time zone.
* **Errors:**
  * If there is no active location, prompt the user to pick one.
  * If API is unavailable: Show last saved data for zip, or output "Weather Unavailable" message.
* **Sequence Diagram Flow:**
  ```mermaid
  sequenceDiagram
      actor User
      participant AppUI as App UI
      participant WeatherService as Weather Service
      participant WeatherAPI as Weather API
      participant Database

      User->>AppUI: open tracking tab
      AppUI->>WeatherService: getHourly(location)
      WeatherService->>WeatherAPI: requestHourly(location)
      alt API ok
          WeatherAPI-->>WeatherService: hourly + sun data
          WeatherService->>Database: store(data, timestamp)
      else API fails
          WeatherService->>Database: getLatest(location)
          Database-->>WeatherService: old data
      end
      WeatherService-->>AppUI: data + timestamp
      AppUI-->>User: show timeline
  ```
* **Postconditions:** User sees hourly precipitation and sun times with a timestamp.

---

### Use Case 3: Save Location
* **Actors:** User
* **Preconditions:** User is logged in.
* **Trigger:** User selects "Add a new monitored location" in the profile.
* **Main Flow:**
  1. User opens the profile and selects "Add a new monitored location."
  2. User enters a ZIP code.
  3. System validates the ZIP and finds the place.
  4. System checks the location isn't already saved.
  5. System saves it to the user's profile.
  6. System shows the updated list of tracked locations.
* **Errors:**
  * **3a.** Invalid or unknown ZIP: show an error and return to step 2.
  * **4a.** Already saved: show "Already saved" and nothing changes.
  * **5a.** Save fails: show "Could not save. Try again."
* **Sequence Diagram Flow:**
  ```mermaid
  sequenceDiagram
      actor User
      participant AppUI as App UI
      participant LocationService as Location Service
      participant Database

      User->>AppUI: enter ZIP
      AppUI->>LocationService: resolveZip(zip)
      alt not found
          LocationService-->>AppUI: no match
          AppUI-->>User: show error
      else found
          LocationService-->>AppUI: place + coordinates
          AppUI->>Database: saveLocation(userId, place)
          alt duplicate
              Database-->>AppUI: already exists
              AppUI-->>User: "Already saved"
          else saved
              Database-->>AppUI: success
              AppUI-->>User: updated list
          end
      end
  ```
* **Postconditions:** Location appears in the user's tracked list; on failure the list is unchanged.

---

### Use Case 4: Track Storm Conditions
* **Actors:** User, External Weather API
* **Preconditions:** An active location is set.
* **Trigger:** User opens the radar/storm view.
* **Main Flow:**
  1. User opens the storm view.
  2. System requests radar, lightning, and flash flood data from the API.
  3. System calculates the distance from the location to each lightning or flood report.
  4. System displays the radar map with markers showing distance and time.
  5. System refreshes the data on a schedule.
* **Errors:**
  * **2a.** No storms nearby: show the map with "No active storms near this location."
  * **2b.** API unavailable: show the last radar data marked "outdated."
* **Sequence Diagram Flow:**
  ```mermaid
  sequenceDiagram
      actor User
      participant AppUI as App UI
      participant WeatherService as Weather Service
      participant WeatherAPI as Weather API
      participant Database

      User->>AppUI: open storm view
      AppUI->>WeatherService: getStormData(location)
      WeatherService->>WeatherAPI: requestStormData(location)
      alt API ok
          WeatherAPI-->>WeatherService: radar, lightning, flood data
          WeatherService->>WeatherService: compute distances
          WeatherService->>Database: store(data, timestamp)
      else API fails
          WeatherService->>Database: getLatest(location)
          Database-->>WeatherService: old data
      end
      WeatherService-->>AppUI: data + distances
      AppUI-->>User: show radar map
  ```
* **Postconditions:** User sees current storm activity with distances and timestamps.

---

### Use Case 5: Natural Language Questioning
* **Example Scenario:** A user wants to go for a walk in Houston and wants to know a good time to do one.
* **Actors:** User
* **Precondition:** The system can process natural language queries.
* **Trigger:** A user submitting a question to the UI chat interface.
* **Main Flow:**
  1. A user submits a question to the chat interface about the weather.
  2. The system receives the question and extracts the type of activity the user is doing, the location of the activity, the time, duration, and acceptable weather conditions for that activity.
  3. The system checks whether the required information is complete.
  4. The system requests the relevant hourly weather forecast from the external weather API.
  5. The system evaluates the forecast against the user's constraints.
  6. The system generates a natural-language response explaining the results.
  7. The system shows the user the results through the chat interface.
* **Errors:**
  * **Missing information:** The system asks the user some follow-up questions for the missing information.
  * **API Weather data unavailable:** The system informs the user that it cannot verify the forecast.
* **Sequence Diagram Flow:**
  ```mermaid
  sequenceDiagram
      actor User
      participant AppUI as App UI
      participant NLP
      participant ConstraintEvaluator as Constraint Evaluator
      participant WeatherAPI as Weather API
      participant ResponseGenerator as Response Generator

      User->>AppUI: Question is asked in chat interface
      AppUI->>NLP: 1. submitQuestion()
      NLP->>ConstraintEvaluator: 2. extractConstraints()
      alt API fail
          ConstraintEvaluator-->>AppUI: errorMesseg()
          AppUI-->>User: displayErrorMesseg()
      else all constraint
          ConstraintEvaluator->>WeatherAPI: 3. getForecast()
          WeatherAPI-->>ConstraintEvaluator: 4. returnForecastData
          ConstraintEvaluator->>ConstraintEvaluator: 5. evaluateConditions()
          ConstraintEvaluator->>ResponseGenerator: 6. sendResults()
          ResponseGenerator-->>AppUI: 7. generateAnswer()
          AppUI-->>User: 8. displayAnswer()
      else missing constraint
          ConstraintEvaluator->>ResponseGenerator: requestClarificationResponse()
          ResponseGenerator-->>AppUI: generateResponse()
          AppUI-->>User: displayResponse()
      end
  ```
* **Postconditions:** The system can provide a response based on the user's question.

---

### Use Case 6: Send Severe Weather Notifications
* **Example Scenario:** A scheduled refresh of the system receives an updated weather alert from an external weather API indicating that a severe thunderstorm is approaching a particular area.
* **Actors:** System worker, External Weather API, User
* **Precondition:** The timer of the scheduled data refresh is working and at defined intervals.
* **Trigger:** A scheduled data refresh.
* **Main Flow:**
  1. The system requests the latest weather information from a weather API.
  2. The API returns updated weather data and severe weather alerts.
  3. The system stores the refreshed data.
  4. The system detects a severe weather warning.
  5. The system finds the affected area and gets users who may be impacted.
  6. The system checks notification preferences of users and whether the alert has already been sent.
  7. Send a notification to warn users.
  8. The system records the delivery of the notification.
* **Errors:**
  * **API Weather data unavailable:** Log the error and retry the data refresh.
  * **User location unavailable:** Exclude the user until location information is available.
* **Sequence Diagram Flow:**
  ```mermaid
  sequenceDiagram
      actor User
      participant Timer as scheduled refresh time
      participant WeatherService as Weather service
      participant WeatherAPI as Weather API
      participant Database
      participant AlertEvaluator as Alert Evaluator
      participant Notification

      Timer->>WeatherService: 1. refreshWeatherData()
      WeatherService->>WeatherAPI: 2. requestLatestWeather()
      WeatherAPI-->>WeatherService: 3. newWeatherData()
      WeatherService->>Database: 4. saveNewWeatherData()
      Database-->>WeatherService: 5. New Weather Data is saved
      WeatherService->>AlertEvaluator: 6. severeWeatherDetected()
      AlertEvaluator->>Database: 7. Get Users, location, and Preferences
      Database-->>AlertEvaluator: 8. Return Users, location, and Preferences
      AlertEvaluator->>AlertEvaluator: 9. match user location to storm
      AlertEvaluator->>Database: 10. CheckIfNotificationSent()
      Database-->>AlertEvaluator: 11. Return notification sent
      AlertEvaluator->>Notification: 12. notifyUser()
      Notification-->>User: 13. sendPushAlertToUser()
      User->>Database: 14. notificationSentToUser()
  ```
* **Postconditions:** Notifications are sent to eligible users when a severe weather event is detected.

---

### Use Case 7: Find Historical Weather Data
* **Example Scenario:** A user wants to find historical weather data in a location over a time period.
* **Actors:** User, External Weather API
* **Precondition:** The user has a location and date in mind to search for.
* **Trigger:** The user submits a request for historical data.
* **Main Flow:**
  1. The user submits a request for historical weather data with the date and location added.
  2. The system checks the location and date to see if they are added.
  3. The system gets the historical weather data from an external weather API.
  4. The system receives the records and prepares a table or graph with the information.
  5. The system displays the table or graph to the user.
* **Errors:**
  * **API Weather data unavailable:** The system tells the user that it cannot get the information.
  * **Invalid date or location:** The system shows an error message to the user explaining what is missing.
* **Sequence Diagram Flow:**
  ```mermaid
  sequenceDiagram
      actor User
      participant AppUI as App UI
      participant WeatherService as Weather service
      participant WeatherAPI as Weather API

      User->>AppUI: 1. enter location and date
      User->>AppUI: 2. click the search button
      AppUI->>WeatherService: 3. historicalWeatherCriteria()
      WeatherService->>WeatherService: 4. check criteria
      alt wrong criteria
          WeatherService-->>AppUI: return error
          AppUI-->>User: display error
      else right criteria
          WeatherService->>WeatherAPI: 5. getHistoricalWeather()
          WeatherAPI-->>WeatherService: 6. return matching historical weather
          WeatherService-->>AppUI: 7. return historical weather
          AppUI-->>User: 8. display chart and tables
      end
  ```
* **Postconditions:** The system displays the requested historical weather data in a table, or graph form.