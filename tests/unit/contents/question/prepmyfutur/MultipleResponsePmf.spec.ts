import { mockStorageInstance } from '../../../helpers/mockStorage';
import { StorageKeys, storageService } from '~contents/services/StorageService';
import { MultipleResponsePmf } from '~contents/question/prepmyfutur/MultipleResponsePmf';
import { prepmyfuturAnwserService } from '~contents/services/PrepmyfuturAnwserService';

jest.mock('@plasmohq/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => {
            return mockStorageInstance;
        })
    };
});

jest.mock('~contents/services/PrepmyfuturAnwserService', () => ({
    prepmyfuturAnwserService: {
        getAnwsers: jest.fn(),
    },
}));

describe('MultipleResponsePmf', () => {
    let handler: MultipleResponsePmf;
    let originalCheckVisibility: typeof Element.prototype.checkVisibility;

    beforeEach(() => {
        handler = new MultipleResponsePmf();
        document.body.innerHTML = '';
        jest.clearAllMocks();
        window.history.pushState({}, '', '/home');
        originalCheckVisibility = Element.prototype.checkVisibility;
    });

    afterEach(() => {
        Element.prototype.checkVisibility = originalCheckVisibility;
    });

    describe('isDetected', () => {
        test('should return true if radio spans exist and are visible', () => {
            document.body.innerHTML = `
                <span class="answer-label qru">
                    <span class="rep-checkbox radio"></span>
                </span>
            `;
            Element.prototype.checkVisibility = jest.fn().mockReturnValue(true);
            expect(handler.isDetected()).toBe(true);
        });

        test('should return false if no radio spans exist', () => {
            expect(handler.isDetected()).toBe(false);
        });

        test('should return false if radio spans exist but are not visible', () => {
            document.body.innerHTML = `
                <span class="answer-label qru">
                    <span class="rep-checkbox radio"></span>
                </span>
            `;
            Element.prototype.checkVisibility = jest.fn().mockReturnValue(false);
            expect(handler.isDetected()).toBe(false);
        });
    });

    describe('getGoodText and getBadText', () => {
        test('should return the correct texts', () => {
            expect(handler.getGoodText()).toBe('📝 Clicking button');
            expect(handler.getBadText()).toBe('📝 Tapping on the screen');
        });
    });

    describe('getGoodAnswer', () => {
        test('should throw error if exercise ID is not in URL', async () => {
            await expect(handler.getGoodAnswer()).rejects.toThrow('Could not find exercise ID in URL');
        });

        test('should throw error if active question target is not found', async () => {
            window.history.pushState({}, '', '?user_exercise_id=12345');
            await expect(handler.getGoodAnswer()).rejects.toThrow('Could not find active question target');
        });

        test('should fetch and return good answer index when target is found', async () => {
            window.history.pushState({}, '', '?id=12345');
            
            document.body.innerHTML = `
                <div id="content_question_111">
                    <span class="checked"></span>
                </div>
                <div id="content_question_222">
                    <!-- active question, no .checked -->
                </div>
            `;

            (prepmyfuturAnwserService.getAnwsers as jest.Mock).mockResolvedValue(2);

            const result = await handler.getGoodAnswer();
            expect(result).toBe(2);
            expect(prepmyfuturAnwserService.getAnwsers).toHaveBeenCalledWith('222', 12345);
        });
    });

    describe('getBadAnswer', () => {
        test('should return a random wrong answer index', async () => {
            window.history.pushState({}, '', '?user_exercise_id=12345');
            
            document.body.innerHTML = `
                <div id="content_question_222">
                    <span class="radio">A</span>
                    <span class="radio">B</span>
                    <span class="radio">C</span>
                    <span class="radio">D</span>
                </div>
            `;

            jest.spyOn(handler, 'getGoodAnswer').mockResolvedValue(1);

            const badAnswer = await handler.getBadAnswer();
            expect([0, 2]).toContain(badAnswer);
        });
    });

    describe('executeAnswer', () => {
        test('should throw error if target question is not found', async () => {
            await expect(handler.executeAnswer(1)).rejects.toThrow('Could not find active question target to execute answer');
        });

        test('should click the correct radio button inside target question', async () => {
            document.body.innerHTML = `
                <div id="content_question_222">
                    <div for="some-id-answer-2">
                        <button class="radio"></button>
                    </div>
                </div>
            `;

            const button = document.querySelector<HTMLButtonElement>('[for$=-answer-2] .radio');
            const clickSpy = jest.spyOn(button, 'click');

            await handler.executeAnswer(1);

            expect(clickSpy).toHaveBeenCalled();
        });
    });

    describe('executeSubmit', () => {
        test('should do nothing if there are unanswered questions', async () => {
            document.body.innerHTML = `
                <div id="content_question_222">
                    <!-- active unanswered question -->
                </div>
                <input type="submit" id="submit-btn" />
            `;
            const submitBtn = document.getElementById('submit-btn') as HTMLInputElement;
            const clickSpy = jest.spyOn(submitBtn, 'click');

            await handler.executeSubmit();
            expect(clickSpy).not.toHaveBeenCalled();
        });

        test('should click submit if all questions are answered', async () => {
            document.body.innerHTML = `
                <div id="content_question_222">
                    <span class="checked"></span>
                </div>
                <input type="submit" id="submit-btn" />
            `;
            const submitBtn = document.getElementById('submit-btn') as HTMLInputElement;
            const clickSpy = jest.spyOn(submitBtn, 'click');

            await handler.executeSubmit();
            expect(clickSpy).toHaveBeenCalled();
            expect(await storageService.get(StorageKeys.STAT_QUIZ_DONE)).toBe(1);
        });
    });
});
