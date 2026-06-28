import { mockStorageInstance } from '../../helpers/mockStorage';
import { prepmyfuturAnwserService } from '~contents/services/PrepmyfuturAnwserService';

jest.mock('@plasmohq/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => {
            return mockStorageInstance;
        })
    };
});

describe('PrepmyfuturAnwserService', () => {
    const htmlContent = `
        <div id="container_solution_49165">
            <div class="question">
                <div class="answer">Answer A</div>
                <div class="answer right">Answer B</div>
                <div class="answer">Answer C</div>
                <div class="answer">Answer D</div>
            </div>
        </div>
        <div id="container_solution_49166">
            <div class="question">
                <div class="answer right">Answer A</div>
                <div class="answer">Answer B</div>
            </div>
        </div>
        <div id="container_solution_49167">
            <div class="question">
                <div class="answer right">Answer A</div>
                <div class="answer">Answer B</div>
            </div>
        </div>
        <div id="container_solution_49170">
            <div class="question">
                <div class="answer">Answer A</div>
                <div class="answer">Answer B</div>
                <div class="answer">Answer C</div>
                <div class="answer right">Answer D</div>
            </div>
        </div>
        <div id="container_solution_49168">
            <div class="question">
                <div class="answer">Answer A</div>
                <div class="answer right">Answer B</div>
            </div>
        </div>
    `;

    let originalFetch: typeof global.fetch;

    beforeAll(() => {
        originalFetch = global.fetch;
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        mockStorageInstance.clear();
        jest.clearAllMocks();
    });

    test('queryAnwsers should parse html content and cache it in storage', async () => {
        const mockResponse = {
            ok: true,
            text: async () => htmlContent,
        } as Response;
        global.fetch = jest.fn().mockResolvedValue(mockResponse);

        const activityId = 12345;
        await prepmyfuturAnwserService.queryAnwsers(activityId);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('user_exercise_id=12345'),
            expect.any(Object)
        );

        const cachedData = await mockStorageInstance.get('pmf-responce-cache-12345');
        expect(cachedData).toBeDefined();
        expect(cachedData.id).toBe(activityId);
        expect(cachedData.questions).toHaveLength(5);

        const firstQuestion = cachedData.questions[0];
        expect(firstQuestion.id).toBe('49165');
        expect(firstQuestion.correct).toBe(1);

        const fourthQuestion = cachedData.questions[3];
        expect(fourthQuestion.id).toBe('49170');
        expect(fourthQuestion.correct).toBe(3);
    });

    test('getAnwsers should return the correct answer index from cached data or query if not cached', async () => {
        const mockResponse = {
            ok: true,
            text: async () => htmlContent,
        } as Response;
        global.fetch = jest.fn().mockResolvedValue(mockResponse);

        const questionId = '49165';
        const activityId = 12345;

        const answer = await prepmyfuturAnwserService.getAnwsers(questionId, activityId);
        expect(answer).toBe(1);

        global.fetch = jest.fn();
        const cachedAnswer = await prepmyfuturAnwserService.getAnwsers(questionId, activityId);
        expect(cachedAnswer).toBe(1);
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test('findAnwsersInResponcePage should throw an error if the questionId is not found', () => {
        const responsePage = {
            id: 12345,
            questions: [
                { id: '49165', correct: 1 }
            ]
        };

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
            prepmyfuturAnwserService.findAnwsersInResponcePage(responsePage, '99999');
        }).toThrow('Match question id not found');
        consoleSpy.mockRestore();
    });
});
