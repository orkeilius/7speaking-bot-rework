import {mockStorageInstance} from '../../helpers/mockStorage';
import {StorageKeys, storageService} from '~contents/services/StorageService';
import {QuestionInterface} from '~contents/question/QuestionInterface';
import {DragAndDrop} from '~contents/question/7speaking/DragAndDrop';
import {EndScreen} from '~contents/question/7speaking/EndScreen';
import {MultipleResponse} from '~contents/question/7speaking/MultipleResponse';
import {TextInput} from '~contents/question/7speaking/TextInput';
import {ToeicInterstitial} from '~contents/question/7speaking/ToeicInterstitial';
import {ToeicMultipleResponse} from '~contents/question/7speaking/ToeicMultipleResponse';
import {logMessage} from '~contents/utils/Logging';
import GetAnswer from '~contents/mainWorldClient/mainWorldFunction/GetAnswer';
import GetAnswerDragAndDrop from '~contents/mainWorldClient/mainWorldFunction/GetAnswerDragAndDrop';
import ExecuteDragAndDrop from '~contents/mainWorldClient/mainWorldFunction/ExecuteDragAndDrop';
import GetAnswerToeic from '~contents/mainWorldClient/mainWorldFunction/GetAnswerToeic';
import {realistInput} from '~contents/utils/InputUtils';

jest.mock('~contents/utils/Logging');
jest.mock('~contents/mainWorldClient/mainWorldFunction/GetAnswer');
jest.mock('~contents/mainWorldClient/mainWorldFunction/GetAnswerDragAndDrop');
jest.mock('~contents/mainWorldClient/mainWorldFunction/ExecuteDragAndDrop');
jest.mock('~contents/mainWorldClient/mainWorldFunction/GetAnswerToeic');
jest.mock('~contents/utils/InputUtils');

class TestQuestion extends QuestionInterface<string> {
    isDetected = jest.fn().mockReturnValue(true);
    getGoodAnswer = jest.fn().mockResolvedValue('good');
    getBadAnswer = jest.fn().mockResolvedValue('bad');
    executeAnswer = jest.fn().mockResolvedValue(undefined);
    getGoodText = () => 'Good Text';
    getBadText = () => 'Bad Text';
    executeSubmit = jest.fn().mockResolvedValue(undefined);
}

describe('QuestionHandlers & QuestionInterface', () => {
    beforeEach(() => {
        mockStorageInstance.clear();
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    describe('QuestionInterface Base Class Flow', () => {
        test('should execute good answer flow when random is above error probability', async () => {
            await mockStorageInstance.set(StorageKeys.ERROR_PROBABILITY.key, 0.2);
            jest.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 >= 0.2, so no error

            const question = new TestQuestion();
            await question.handler();

            expect(question.getGoodAnswer).toHaveBeenCalled();
            expect(question.executeAnswer).toHaveBeenCalledWith('good');
            expect(question.executeSubmit).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('Good Text');
            // STAT_QUESTION_DONE custom setter increments by 1
            expect(await storageService.get(StorageKeys.STAT_QUESTION_DONE)).toBe(1);
        });

        test('should execute bad answer flow when random is below error probability', async () => {
            await mockStorageInstance.set(StorageKeys.ERROR_PROBABILITY.key, 0.2);
            jest.spyOn(Math, 'random').mockReturnValue(0.1); // 0.1 < 0.2, so error

            const question = new TestQuestion();
            await question.handler();

            expect(question.getBadAnswer).toHaveBeenCalled();
            expect(question.executeAnswer).toHaveBeenCalledWith('bad');
            expect(question.executeSubmit).toHaveBeenCalled();
            expect(logMessage).toHaveBeenCalledWith('Bad Text');
        });

        test('should log warning message if any error occurs in the flow', async () => {
            const question = new TestQuestion();
            question.getGoodAnswer.mockRejectedValue(new Error('something failed'));
            await mockStorageInstance.set(StorageKeys.ERROR_PROBABILITY.key, 0.0);

            await question.handler();

            expect(logMessage).toHaveBeenCalledWith('⚠️ Error executing good answer, (Error: something failed)');
        });
    });

    describe('TextInput Handler', () => {
        test('isDetected checks for input[type=text]', () => {
            const handler = new TextInput();
            expect(handler.isDetected()).toBe(false);

            const form = document.createElement('form');
            form.className = 'question__form';
            const input = document.createElement('input');
            input.type = 'text';
            form.appendChild(input);
            document.body.appendChild(form);

            expect(handler.isDetected()).toBe(true);
        });

        test('getGoodAnswer queries client GetAnswer', async () => {
            jest.spyOn(GetAnswer.prototype, 'callFunction').mockResolvedValue('test answer');

            const handler = new TextInput();
            const ans = await handler.getGoodAnswer();
            expect(ans).toBe('test answer');
        });

        test('getBadAnswer scrambles good answer', async () => {
            jest.spyOn(GetAnswer.prototype, 'callFunction').mockResolvedValue('abc');

            const handler = new TextInput();
            const bad = await handler.getBadAnswer();
            expect(bad.length).toBe(3);
            expect(bad[0]).toBe(bad[0].toUpperCase());
        });

        test('executeAnswer types into input using realistInput', async () => {
            const input = document.createElement('input');
            input.type = 'text';
            const form = document.createElement('form');
            form.className = 'question__form';
            form.appendChild(input);
            document.body.appendChild(form);

            const handler = new TextInput();
            await handler.executeAnswer('my answer');

            expect(realistInput).toHaveBeenCalledWith(input, 'my answer');
        });
    });

    describe('MultipleResponse Handler', () => {
        test('isDetected checks for button inside answer-container', () => {
            const handler = new MultipleResponse();
            expect(handler.isDetected()).toBe(false);

            const container = document.createElement('div');
            container.className = 'answer-container';
            const btn = document.createElement('button');
            container.appendChild(btn);
            document.body.appendChild(container);

            expect(handler.isDetected()).toBe(true);
        });

        test('getBadAnswer returns different button text than good answer', async () => {
            const container = document.createElement('div');
            container.className = 'answer-container';
            const btn1 = document.createElement('button');
            btn1.innerHTML = '<span>Good Option</span>';
            const btn2 = document.createElement('button');
            btn2.innerHTML = '<span>Bad Option</span>';
            container.appendChild(btn1);
            container.appendChild(btn2);
            document.body.appendChild(container);

            jest.spyOn(GetAnswer.prototype, 'callFunction').mockResolvedValue('Good Option');

            const handler = new MultipleResponse();
            const bad = await handler.getBadAnswer();
            expect(bad).toBe('Bad Option');
        });

        test('executeAnswer clicks the button containing the answer', async () => {
            const container = document.createElement('div');
            container.className = 'answer-container';
            const btn = document.createElement('button');
            btn.innerHTML = '<span>Match</span>';
            const clickSpy = jest.spyOn(btn, 'click');
            container.appendChild(btn);
            document.body.appendChild(container);

            const handler = new MultipleResponse();
            await handler.executeAnswer('Match');
            expect(clickSpy).toHaveBeenCalled();
        });
    });

    describe('DragAndDrop Handler', () => {
        test('isDetected checks for dropZone inside answer-container', () => {
            const handler = new DragAndDrop();
            expect(handler.isDetected()).toBe(false);

            const container = document.createElement('div');
            container.className = 'answer-container';
            const dropZone = document.createElement('div');
            dropZone.className = 'dropZone';
            container.appendChild(dropZone);
            document.body.appendChild(container);

            expect(handler.isDetected()).toBe(true);
        });

        test('getGoodAnswer maps raw response to drag/dropzone ids', async () => {
            jest.spyOn(GetAnswerDragAndDrop.prototype, 'callFunction').mockResolvedValue({
                options: [{id: 10, content: 'a', displayOrder: 0}],
                answers: [],
            });

            const handler = new DragAndDrop();
            const ans = await handler.getGoodAnswer();
            expect(ans).toEqual([
                {dragId: 10, dropzoneId: 10},
            ]);
        });

        test('getBadAnswer shifts dragIds relative to dropzoneIds', async () => {
            jest.spyOn(GetAnswerDragAndDrop.prototype, 'callFunction').mockResolvedValue({
                options: [{id: 10, content: 'a', displayOrder: 0}, {id: 20, content: 'b', displayOrder: 1}],
                answers: [],
            });

            const handler = new DragAndDrop();
            const ans = await handler.getBadAnswer();
            expect(ans[0].dragId).toBeUndefined();
            expect(ans[0].dropzoneId).toBe(10);
            expect(ans[1].dragId).toBe(10);
            expect(ans[1].dropzoneId).toBe(20);
        });

        test('executeAnswer triggers drag and drop functions sequentially', async () => {
            const executeSpy = jest.spyOn(ExecuteDragAndDrop.prototype, 'callFunction').mockResolvedValue(undefined);
            const handler = new DragAndDrop();
            await handler.executeAnswer([
                {dragId: 1, dropzoneId: 1},
                {dragId: 2, dropzoneId: 2},
            ]);
            expect(executeSpy).toHaveBeenCalledTimes(2);
            expect(executeSpy).toHaveBeenNthCalledWith(1, {dragId: 1, dropzoneId: 1});
            expect(executeSpy).toHaveBeenNthCalledWith(2, {dragId: 2, dropzoneId: 2});
        });
    });

    describe('EndScreen Handler', () => {
        test('isDetected checks for back button inside result-container', () => {
            const handler = new EndScreen();
            expect(handler.isDetected()).toBe(false);

            const container = document.createElement('div');
            container.className = 'result-container';
            const btn = document.createElement('button');
            btn.className = 'back';
            container.appendChild(btn);
            document.body.appendChild(container);

            expect(handler.isDetected()).toBe(true);
        });

        test('executeSubmit clicks back, updates STAT_QUIZ_DONE and LAST_QUIZ_COMPLETED', async () => {
            const container = document.createElement('div');
            container.className = 'result-container';
            const btn = document.createElement('button');
            btn.className = 'back';
            const clickSpy = jest.spyOn(btn, 'click');
            container.appendChild(btn);
            document.body.appendChild(container);

            await mockStorageInstance.set(StorageKeys.LAST_LESSON_WAITED.key, 'lesson-url');

            const handler = new EndScreen();
            await handler.executeSubmit();

            expect(clickSpy).toHaveBeenCalled();
            expect(await storageService.get(StorageKeys.STAT_QUIZ_DONE)).toBe(1);
            expect(await storageService.get(StorageKeys.LAST_QUIZ_COMPLETED)).toBe('lesson-url');
        });
    });

    describe('ToeicInterstitial Handler', () => {
        test('isDetected checks empty questions variants container', () => {
            const handler = new ToeicInterstitial();
            expect(handler.isDetected()).toBe(false);

            const container = document.createElement('div');
            container.className = 'ExamsAndTests__container';
            const variants = document.createElement('div');
            variants.className = 'questions_variantsContainer';
            const emptyDiv = document.createElement('div');
            variants.appendChild(emptyDiv);
            container.appendChild(variants);
            document.body.appendChild(container);

            expect(handler.isDetected()).toBe(true);
        });

        test('executeSubmit clicks primary material-ui button', async () => {
            const container = document.createElement('div');
            container.className = 'buttons_container';
            const btn = document.createElement('button');
            btn.className = 'MuiButton-containedPrimary';
            const clickSpy = jest.spyOn(btn, 'click');
            container.appendChild(btn);
            document.body.appendChild(container);

            const handler = new ToeicInterstitial();
            await handler.executeSubmit();

            expect(clickSpy).toHaveBeenCalled();
        });
    });

    describe('ToeicMultipleResponse Handler', () => {
        test('isDetected checks for radio buttons inside question variants', () => {
            const handler = new ToeicMultipleResponse();
            expect(handler.isDetected()).toBe(false);

            const exams = document.createElement('div');
            exams.className = 'ExamsAndTests__container';
            const container = document.createElement('div');
            container.className = 'questions_variantsContainer';
            const input = document.createElement('input');
            input.type = 'radio';
            container.appendChild(input);
            exams.appendChild(container);
            document.body.appendChild(exams);

            expect(handler.isDetected()).toBe(true);
        });

        test('getGoodAnswer extracts last word', async () => {
            jest.spyOn(GetAnswerToeic.prototype, 'callFunction').mockResolvedValue('The correct answer is Option A');
            const handler = new ToeicMultipleResponse();
            const ans = await handler.getGoodAnswer();
            expect(ans).toBe('A');
        });

        test('getBadAnswer returns random option label excluding good answer', async () => {
            document.body.innerHTML = `
        <div class="choice_variant">
          <label class="MuiFormControlLabel-root">
            <input type="radio" value="1"/>
            <span class="MuiFormControlLabel-label">Option A</span>
          </label>
        </div>
        <div class="choice_variant">
          <label class="MuiFormControlLabel-root">
            <input type="radio" value="2"/>
            <span class="MuiFormControlLabel-label">Option B</span>
          </label>
        </div>
      `;

            jest.spyOn(GetAnswerToeic.prototype, 'callFunction').mockResolvedValue('Option A');

            const handler = new ToeicMultipleResponse();
            const bad = await handler.getBadAnswer();
            expect(bad).toBe('Option B');
        });

        test('executeAnswer clicks choice input', async () => {
            document.body.innerHTML = `
        <div class="choice_variant">
          <label class="MuiFormControlLabel-root">
            <input type="radio" id="target-radio"/>
            <span class="MuiFormControlLabel-label">Option A</span>
          </label>
        </div>
      `;

            const input = document.getElementById('target-radio') as HTMLInputElement;
            const clickSpy = jest.spyOn(input, 'click');

            const handler = new ToeicMultipleResponse();
            await handler.executeAnswer('Option A');

            expect(clickSpy).toHaveBeenCalled();
        });
    });
});
