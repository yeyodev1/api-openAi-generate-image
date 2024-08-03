import OpenAI from 'openai';
import { EventEmitter } from 'node:events';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const OPEN_AI_MODEL = process.env.OPEN_AI_MODEL ?? 'gpt-3.5-turbo'; //gpt-3.5-turbo

/**
 * Class
 */
class AIClass extends EventEmitter {
	private openai: OpenAI;
	constructor(apiKey: string) {
		super();
		this.openai = new OpenAI({ apiKey, timeout: 15 * 1000 });
		if (!apiKey || apiKey.length === 0) {
			throw new Error("OPENAI_KEY is missing");
		}
	}

	createChat = async (
		messages: ChatCompletionMessageParam[],
		model?: string,
		temperature = 0
	) => {
		try {
			const completion = await this.openai.chat.completions.create({
				model: model ?? OPEN_AI_MODEL,
				messages,
				temperature,
				max_tokens: 256,
				top_p: 0,
				frequency_penalty: 0,
				presence_penalty: 0,
			});
			this.emit("gas_token", {
				amount: (completion?.usage!.total_tokens ?? 0) + 10000,
			});
			return completion.choices[0].message.content;
		} catch (err) {
			console.error(err);
			return "ERROR";
		}
	};

	/**
	 * experimental! 🔔
	 * @param messages
	 * @param model
	 * @param temperature
	 * @returns
	 */
	createChatFn = async (
		messages: ChatCompletionMessageParam[],
		model?: string,
		temperature = 0
	): Promise<{
		bestAnswer: string;
		prediction: string;
		listItems: string[];
	}> => {
		try {
			const completion = await this.openai.chat.completions.create({
				model: model ?? OPEN_AI_MODEL,
				temperature: temperature,
				messages,
				functions: [
					{
						name: "fn_conversation_customer",
						description:
							"Obtain the best response for the customer",
						parameters: {
							type: "object",
							properties: {
								bestAnswer: {
									type: "string",
									description:
										"the best response to the customer by offering him the dish by being friendly",
								},
								listItems: {
									type: "array",
									items: {
										type: "string",
									},
									description:
										"give me the list of dishes and their prices or what you would recommend to the client based on their tastes.",
								},
								prediction: {
									type: "string",
									enum: [
										"still_in_conversation",
										"show_menu_items",
										"add_more",
									],
									description:
										"based on the history between the customer and the seller, determine whether the customer has already given a clear confirmation of order.",
								},
							},
							required: ["bestAnswer", "prediction", "listItems"],
						},
					},
				],
				function_call: {
					name: "fn_conversation_customer",
				},
			});
			// Convert json to object
			const response = JSON.parse(
				completion.choices[0].message.function_call!.arguments
			);

			return response;
		} catch (err) {
			console.error(err);
			return {
				bestAnswer: "",
				listItems: [],
				prediction: "error",
			};
		}
	};

	readImage = async (base64: string, prompt: string, mimetype='image/jpeg') => {
		try {
			// const buffer = readFileSync(pathImage);

			// const base64 = buffer.toString("base64");
			const response = await this.openai.chat.completions.create({
				model: "gpt-4-vision-preview",
				messages: [
					{
						role: "user",
						content: [
							{ type: "text", text: prompt },
							{
								type: "image_url",
								image_url: {
									url: `data:${mimetype};base64,${base64}`,
								},
							},
						],
					},
				],
			});

			return response.choices[0].message.content;
		} catch (err) {
			console.error(err);
			return "ERROR";
		}
	};

	generateImage = async (prompt: string) => {
		try {
			const response = await this.openai.images.generate({
				prompt,
				model: 'dall-e-3',
				size: '1024x1024',
				n: 1
			});
			return response.data[0].url;
		} catch (err) {
			console.error(err);
			return "ERROR";
		}
	};
}

export default AIClass;