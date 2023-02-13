import * as ada from "ada-class-client";
import loadFromGoogleMeet from "attendance-report";
import SearchUtil from "./util/ListUtil";

export class App {

    async run(url, user, pass, turmaId, teachers) {

        const client = new ada.Client(await ada.SessionProvider.getSession(url, user, pass))

        const lessonsService = new ada.Lessons(client);
        const attendanceService = new ada.Attendances(client, lessonsService)

        const meetAttendanceList = loadFromGoogleMeet()
        

        const meetAttendanceList_onlyStudents = meetAttendanceList.filter(name => {
            return !teachers.includes(name) &&
                !name.includes("(You)" &&
                    !name.includes("(Você)"))
        })

        console.log(meetAttendanceList_onlyStudents)

        const attendanceForTodaysLesson = await attendanceService.getAttendanceForTodaysLesson(turmaId);

        const fuzzyOptions = {
            includeScore: true,
            threshold: 1,
            keys: ['name']
        }

        let attendanceListFilteredWithFuzzySearch = SearchUtil.fuzzySearchByMaxScore(meetAttendanceList_onlyStudents, attendanceForTodaysLesson, "uuid", fuzzyOptions)

        
        attendanceListFilteredWithFuzzySearch.forEach(item => {
            item.present = true
            item.remote = true
        })
        console.debug(attendanceListFilteredWithFuzzySearch)

        await attendanceService.setAttendanceForTodaysLesson(turmaId, JSON.stringify(attendanceListFilteredWithFuzzySearch))

    }
}