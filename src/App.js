import * as ada from "ada-class-client";
import loadFromGoogleMeet from "attendance-report";
import SearchUtil from "./util/ListUtil";

export class App {

    async run(url, user, pass, turmaId, teachers, threshold) {

        const client = new ada.Client(await ada.SessionProvider.getSession(url, user, pass))

        const lessonsService = new ada.Lessons(client);
        const attendanceService = new ada.Attendances(client, lessonsService)

        const meetAttendanceList = loadFromGoogleMeet()

        const meetAttendanceList_onlyStudents = meetAttendanceList.filter(name => {
            return !teachers.includes(name) &&
                !name.includes("(You)" &&
                    !name.includes("(Você)"))
        })

        console.debug("Google Meet Attendance list")
        console.debug(meetAttendanceList_onlyStudents)

        const attendanceForTodaysLesson = await attendanceService.getAttendanceForTodaysLesson(turmaId);

        const invalidThreshold = threshold == null || isNaN(threshold) || (parseFloat(threshold) < 0 || parseFloat(threshold) > 1)
        if (invalidThreshold)
            threshold = 0.4
        console.debug("fuzzy threshold: " + threshold)

        const fuzzyOptions = {
            includeScore: true,
            threshold: threshold,
            keys: ['name']
        }

        let attendanceListFilteredWithFuzzySearch = SearchUtil.fuzzySearchByMaxScore(meetAttendanceList_onlyStudents, attendanceForTodaysLesson, "uuid", fuzzyOptions)

        attendanceListFilteredWithFuzzySearch.forEach(item => {
            item.present = true
            item.remote = true
        })
        console.debug("Class Attendance list")
        console.debug(attendanceListFilteredWithFuzzySearch)
        
        console.debug("Auxiliar teacher (ME) added to Attendance list")
        const todayLesson = await lessonsService.getTodayLesson(turmaId)
        let auxiliarTeacher = todayLesson.auxTeacherDTO
        auxiliarTeacher.date = new Date().toISOString()
        auxiliarTeacher.isMe = true
        auxiliarTeacher.present = true
        let attendanceListFilteredWithFuzzySearchAndWithAuxTeacherAdded = attendanceListFilteredWithFuzzySearch.concat(auxiliarTeacher)
        console.debug(attendanceListFilteredWithFuzzySearchAndWithAuxTeacherAdded)
        
        await attendanceService.setAttendanceForTodaysLesson(turmaId, JSON.stringify(attendanceListFilteredWithFuzzySearchAndWithAuxTeacherAdded))
    }
}