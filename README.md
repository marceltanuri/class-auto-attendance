# Class Auto Attendance

It automates attendance task for Ada Class todays lesson by using the Ada Class API.

## How to use it

* `npm install`
* Run the createCommandForConsole with API_URL, user, turmaId and teacher names as a parameters
    * -u `your username to get access to Ada Class`
    * -h `Ada Class API baseURL, you might need to inspect Ada Class Web APP to find it`
    * -t `The class identifier (turmaId), you might also need to inspect Ada Class Web APP to find it`
    * -p `Teacher names, the program will exclude teachers to the attendance list`
    * -f (optional) `Fuzzy threshold that will be used to compare the student name from meeting attendance list with the name stored in the Ada Class database. Default threshold is 0.4, moderated. Minimum value is 0 (hight precision), max value is 1 (soft precision)`
    * your Ada Class password will be asked in silent mode

<br/>
* Example 

```bash
sh ./createCommandForConsole.sh -h "https://clazz-api.letscode.com.br/api/v1" -u "mario.bros@nintendo.foo" -t "my-turma-id-123456" -p "'Teacher 001', 'Teacher 002'" -f "0.4"
```
* After running the shell script, a text will be set to your clipboard. This is the command you have to paste in your on going google meeting session. Go to your browser, in your on going google meeting and paste the command into the browser console. 

* Once the bash script `createCommandForConsole.sh` is executed the minified `javascript` program is generated and saved at `./dist/createCommandForConsole.js`, so there is no reason to run the bash script again, you can just copy the `createCommandForConsole.js` content