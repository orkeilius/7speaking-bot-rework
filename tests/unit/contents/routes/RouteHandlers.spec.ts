import {mockStorageInstance} from '../../helpers/mockStorage';
import {HomeHandler} from '~contents/routes/7speaking/HomeHandler';
import {BeginnerWorkshopHandler} from '~contents/routes/7speaking/BeginnerWorkshopHandler';
import {LearningHandler7s} from '~contents/routes/7speaking/LearningHandler7s';
import {LearningHandlerPmf} from '~contents/routes/prepmyfutur/LearningHandlerPmf';
import {QuizzAccessHandlerPmf} from '~contents/routes/prepmyfutur/QuizzAccessHandlerPmf';
import {QuizzHandler} from '~contents/routes/QuizzHandler';
import {StorageKeys, storageService} from '~contents/services/StorageService';
import {timeService} from '~contents/services/TimerService';
import {logMessage} from '~contents/utils/Logging';

jest.mock('~contents/utils/Logging', () => ({
    logMessage: jest.fn(),
}));
jest.mock('~contents/services/TimerService', () => ({
    timeService: {
        isWaitingEnded: jest.fn(),
    },
    TimerType: {
        QUIZ: 0,
        QUESTION: 1,
    },
}));

describe('Route Handlers', () => {
    beforeEach(() => {
        mockStorageInstance.clear();
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    describe('HomeHandler', () => {
        test('isDetected checks if location.pathname starts with /home', () => {
            const handler = new HomeHandler();

            window.history.pushState({}, '', '/home');
            expect(handler.isDetected()).toBe(true);

            window.history.pushState({}, '', '/quiz');
            expect(handler.isDetected()).toBe(false);
        });

        test('handler clicks start button if found', async () => {
            const parent = document.createElement('div');
            parent.className = 'learningSection__scrollableList';
            const child = document.createElement('div');
            child.className = 'learningSection__scrollableList__content';
            const btn = document.createElement('button');
            btn.className = 'MuiButtonBase-root';
            btn.click = jest.fn();

            child.appendChild(btn);
            parent.appendChild(child);
            document.body.appendChild(parent);

            const handler = new HomeHandler();
            await handler.handler();

            expect(btn.click).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('🧠 Starting lesson...');
        });

        test('handler logs message if start button is not found', async () => {
            const handler = new HomeHandler();
            await handler.handler();
            expect(logMessage).toHaveBeenCalledWith('🤔 Lesson not found');
        });
    });

    describe('BeginnerWorkshopHandler', () => {
        test('isDetected checks if location.pathname matches /workshop.*beginners-workshop', () => {
            const handler = new BeginnerWorkshopHandler();

            window.history.pushState({}, '', '/workshop/beginners-workshop');
            expect(handler.isDetected()).toBe(true);

            window.history.pushState({}, '', '/home');
            expect(handler.isDetected()).toBe(false);
        });

        test('handler clicks next button if present', async () => {
            const btn = document.createElement('button');
            btn.className = 'next__btn';
            btn.click = jest.fn();
            document.body.appendChild(btn);

            const handler = new BeginnerWorkshopHandler();
            await handler.handler();

            expect(btn.click).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('➡️ Next button found, clicking...');
        });

        test('handler clicks validate button and fills quiz if present and disabled', async () => {
            const validateBtn = document.createElement('button');
            validateBtn.className = 'validate__btn';
            validateBtn.setAttribute('disabled', 'true');
            validateBtn.click = jest.fn();
            document.body.appendChild(validateBtn);

            const quiz = document.createElement('div');
            quiz.className = 'beginners_topic__content';
            const card = document.createElement('div');
            card.className = 'MuiCardContent-root';
            const q = document.createElement('div');
            q.className = 'beginners_lesson__element7Question';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.click = jest.fn();

            q.appendChild(radio);
            card.appendChild(q);
            quiz.appendChild(card);
            document.body.appendChild(quiz);

            const handler = new BeginnerWorkshopHandler();
            await handler.handler();

            expect(radio.click).toHaveBeenCalled();
            expect(validateBtn.click).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('✅ Validate button found, clicking...');
        });
    });

    describe('LearningHandler', () => {
        test('isDetected checks if any quiz button exists', () => {
            const handler = new LearningHandler7s();
            expect(handler.isDetected()).toBe(false);

            const btn = document.createElement('button');
            btn.className = 'sheet__quizButton';
            document.body.appendChild(btn);

            expect(handler.isDetected()).toBe(true);
        });

        test('handler redirects back if quiz is already completed', async () => {
            window.history.pushState({}, '', '/learning/lesson-1');
            await mockStorageInstance.set(StorageKeys.LAST_QUIZ_COMPLETED.key, 'https://user.7speaking.com/learning/lesson-1');

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
            });

            const handler = new LearningHandler7s();

            // JSDOM logs a "Not implemented: navigation" error instead of throwing when location.replace is called.
            await handler.handler();

            expect(consoleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringMatching(/Not implemented: navigation/i)
            }));
            expect(logMessage).toHaveBeenCalledWith('⁉️ lesson already done going back');

            consoleErrorSpy.mockRestore();
        });

        test('handler clicks quiz button if waiting ended', async () => {
            (timeService.isWaitingEnded as jest.Mock).mockResolvedValue(true);

            const btn = document.createElement('button');
            btn.className = 'sheet__quizButton';
            btn.click = jest.fn();
            document.body.appendChild(btn);

            const handler = new LearningHandler7s();
            await handler.handler();

            expect(btn.click).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('☝️🤓 quiz time!');
        });
    });

    describe('LearningHandlerPmf', () => {
        test('isDetected checks if location.pathname matches /platform/.*/lesson_tab/.*', () => {
            const handler = new LearningHandlerPmf();

            window.history.pushState({}, '', '/platform/abc123/lesson_tab/1');
            expect(handler.isDetected()).toBe(true);

            window.history.pushState({}, '', '/platform/course/lesson_tab/content');
            expect(handler.isDetected()).toBe(true);

            window.history.pushState({}, '', '/home');
            expect(handler.isDetected()).toBe(false);
        });

        test('handler returns early if waiting has not ended', async () => {
            (timeService.isWaitingEnded as jest.Mock).mockResolvedValue(false);

            const btn = document.createElement('a');
            btn.className = 'btn btn-primary';
            btn.click = jest.fn();
            document.body.appendChild(btn);

            const handler = new LearningHandlerPmf();
            await handler.handler();

            expect(btn.click).not.toHaveBeenCalled();
            expect(logMessage).not.toHaveBeenCalled();
        });

        test('handler clicks button if waiting has ended', async () => {
            (timeService.isWaitingEnded as jest.Mock).mockResolvedValue(true);

            const btn = document.createElement('a');
            btn.className = 'btn btn-primary';
            btn.click = jest.fn();
            document.body.appendChild(btn);

            const handler = new LearningHandlerPmf();
            await handler.handler();

            expect(btn.click).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('💡 In to the next one');
        });

        test('handler updates stat when waiting has ended', async () => {
            (timeService.isWaitingEnded as jest.Mock).mockResolvedValue(true);

            const btn = document.createElement('a');
            btn.className = 'btn btn-primary';
            btn.click = jest.fn();
            document.body.appendChild(btn);

            const handler = new LearningHandlerPmf();
            await handler.handler();

            expect(await storageService.get(StorageKeys.STAT_QUIZ_DONE)).toBe(1);
        });
    });

    describe('QuizzAccessHandlerPmf', () => {
        test('isDetected checks if location.pathname matches /platform/.*/access_.*', () => {
            const handler = new QuizzAccessHandlerPmf();

            window.history.pushState({}, '', '/platform/abc123/access_quiz');
            expect(handler.isDetected()).toBe(true);

            window.history.pushState({}, '', '/platform/course/access_lesson');
            expect(handler.isDetected()).toBe(true);

            window.history.pushState({}, '', '/home');
            expect(handler.isDetected()).toBe(false);
        });

        test('handler clicks quiz button when quiz is not completed', async () => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            const mainActivity = document.createElement('div');
            mainActivity.className = 'main_activity';
            mainActivity.appendChild(btn);
            document.body.appendChild(mainActivity);

            const handler = new QuizzAccessHandlerPmf();
            const clickSpy = jest.spyOn(btn, 'click');

            await handler.handler();

            expect(clickSpy).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('☝️🤓 quiz time!');
        });

        test('handler skips to next when quiz is completed', async () => {
            const skipBtn = document.createElement('button');
            skipBtn.className = 'btn btn-primary';
            const header = document.createElement('div');
            header.id = 'study-plan-unit-header';
            header.appendChild(skipBtn);
            document.body.appendChild(header);

            const completedStatus = document.createElement('div');
            completedStatus.className = 'activity_statut_completed';
            document.body.appendChild(completedStatus);

            const handler = new QuizzAccessHandlerPmf();
            const clickSpy = jest.spyOn(skipBtn, 'click');

            await handler.handler();

            expect(clickSpy).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('⏩ Skipping');
        });

        test('handler logs message when quiz is completed but skip button not found', async () => {
            const completedStatus = document.createElement('div');
            completedStatus.className = 'activity_statut_completed';
            document.body.appendChild(completedStatus);

            const handler = new QuizzAccessHandlerPmf();
            await handler.handler();

            expect(logMessage).toHaveBeenCalledWith('😓 already done ...');
        });
    });
    describe('QuizzHandler', () => {
        test('isDetected returns true if route matches /quiz or question handler is detected', () => {
            const handler = new QuizzHandler();

            window.history.pushState({}, '', '/quiz');
            expect(handler.isDetected()).toBe(true);

            window.history.pushState({}, '', '/home');
            expect(handler.isDetected()).toBe(false);
        });

        test('handler executes matched question flow when waiting ended', async () => {
            (timeService.isWaitingEnded as jest.Mock).mockResolvedValue(true);

            const mockQuestion = QuizzHandler.listQuestion[0];
            const isDetectedSpy = jest.spyOn(mockQuestion, 'isDetected').mockReturnValue(true);
            const handlerSpy = jest.spyOn(mockQuestion, 'handler').mockResolvedValue(undefined);

            const handler = new QuizzHandler();
            await handler.handler();

            expect(handlerSpy).toHaveBeenCalled();

            isDetectedSpy.mockRestore();
            handlerSpy.mockRestore();
        });

        test('handler logs message if no question type detected', async () => {
            const handler = new QuizzHandler();
            const spies = QuizzHandler.listQuestion.map(q => jest.spyOn(q, 'isDetected').mockReturnValue(false));

            await handler.handler();

            expect(logMessage).toHaveBeenCalledWith('❓ Question type not found');

            spies.forEach(s => s.mockRestore());
        });
    });
});
