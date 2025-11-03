
export class Constants {

    static readonly maxTimeUseDiffTooLong = 1000 * 60;

    static readonly NextButtonSelector = 'button.next__btn'
    static readonly ValidateButtonSelector = 'button.validate__btn'
    static readonly BackButtonSelector = 'button.back__btn'
    static readonly PopUpDialogSelector = 'div.selectViewModal__Card'
    static readonly VocabularyQuizSelector = "div:is([class$=_girdMode_container],[class$=_listMode__container]) > button.cardMode__goToQuiz"
    static readonly VocabularyQuizSheetSelector = "button.sheet__quizButton"
    static readonly QuizTabSelector = "div.appBarTabs__testTab"
    static readonly QuizValidateSelector = ".question__btns__container button[type=submit]:not([disabled])"
    static readonly ToeicQuizNextSelector = "div.buttons_container button[class*='MuiButton-containedPrimary']"
}