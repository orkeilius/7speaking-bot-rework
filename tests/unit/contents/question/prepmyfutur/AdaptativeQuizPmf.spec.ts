import { mockStorageInstance } from '../../../helpers/mockStorage';
import { StorageKeys, storageService } from '~contents/services/StorageService';
import { AdaptativeQuizPmf } from '~contents/question/prepmyfutur/AdaptativeQuizPmf';

jest.mock('@plasmohq/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => {
            return mockStorageInstance;
        })
    };
});

describe('AdaptativeQuizPmf', () => {
    let handler: AdaptativeQuizPmf;
    let originalCheckVisibility: typeof Element.prototype.checkVisibility;

    beforeEach(() => {
        handler = new AdaptativeQuizPmf();
        document.body.innerHTML = '';
        jest.clearAllMocks();
        window.history.pushState({}, '', '/home');
        originalCheckVisibility = Element.prototype.checkVisibility;
    });

    afterEach(() => {
        Element.prototype.checkVisibility = originalCheckVisibility;
    });

    describe('isDetected', () => {
        test('should return true when radio spans, explanations_box exist, and not a result page', () => {
            document.body.innerHTML = `
                <span class="answer-label qru">
                    <span class="rep-checkbox radio"></span>
                </span>
                <div id="explanations_box"></div>
            `;
            Element.prototype.checkVisibility = jest.fn().mockReturnValue(false);
            expect(handler.isDetected()).toBe(true);
        });

        test('should return false when no radio spans exist', () => {
            document.body.innerHTML = `
                <div id="explanations_box"></div>
            `;
            Element.prototype.checkVisibility = jest.fn().mockReturnValue(false);
            expect(handler.isDetected()).toBe(false);
        });

        test('should return false when explanations_box does not exist', () => {
            document.body.innerHTML = `
                <span class="answer-label qru">
                    <span class="rep-checkbox radio"></span>
                </span>
            `;
            expect(handler.isDetected()).toBe(false);
        });

        test('should return false when explanations_box is visible (result page)', () => {
            document.body.innerHTML = `
                <span class="answer-label qru">
                    <span class="rep-checkbox radio"></span>
                </span>
                <div id="explanations_box"></div>
            `;
            Element.prototype.checkVisibility = jest.fn().mockReturnValue(true);
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
        test('should throw error if no solution container found', async () => {
            await expect(handler.getGoodAnswer()).rejects.toThrow('Could not find solution container for adaptive question');
        });

        test('should throw error if no correct answer found in solution container', async () => {
            document.body.innerHTML = `
                <div id="container_solution_123">
                    <div class="question">
                        <div class="answer">Wrong A</div>
                        <div class="answer">Wrong B</div>
                    </div>
                </div>
            `;
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await expect(handler.getGoodAnswer()).rejects.toThrow('Could not find correct answer in adaptive question solution');
            consoleSpy.mockRestore();
        });

        test('should return index of correct answer from solution container', async () => {
            document.body.innerHTML = `
                <div id="container_solution_123">
                    <div class="question">
                        <div class="answer">Wrong A</div>
                        <div class="answer right">Correct B</div>
                        <div class="answer">Wrong C</div>
                    </div>
                </div>
            `;
            const result = await handler.getGoodAnswer();
            expect(result).toBe(1);
        });
    });

    describe('getBadAnswer', () => {
        test('should return a random wrong answer index', async () => {
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
