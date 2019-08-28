/**
 * The simplest definition of an Action
 */
export interface Action<T = any> {
    type: T;
}

/**
 * An object whose properties are reducing functions.
 */
export type ReducersMap<S = any, A extends Action = Action> = {
    [prop in keyof S]: Reducer<S[prop], A>;
}

/**
 * An object whose properties are either reducing function or @see NestedReducersMap
 */
export type NestedReducersMap<S = any, A extends Action = Action> = {
    [prop in keyof S]: Reducer<S[prop], A> | NestedReducersMap<S[prop], A>
}

/**
 * A reducing function
 */
export type Reducer<S = any, A extends Action = Action> = (state: S | undefined, action: A) => S;

/**
 * A function that turns an object whose properties are reducing functions into a single reducing function.
 */
export type CombineReducersFn<S = any, A extends Action = Action> = (reducersMap: ReducersMap<S, A>) => Reducer<S, A>

/**
 * Execution data recorded to resume a partial execution later on
 */
interface StackFrame {

    map: object;

    mapKeys: string[];

    currentMapKey: string | null;

    currentMapKeyIndex: number;

    previousMapKey: string | null;

    flatMap: any;

    previousFlatMap: any;

}

/**
 * Peeks an element from the Stack given.
 * Peeking means getting the element that you would get with a pop() without actually removing the element from the Stack.
 */
// function peek<TElement>(stack: TElement[]): TElement {

//     if (!Array.isArray(stack)) throw new Error('The array-thing passed is not really an Array !');
//     if (stack.length === 0) throw new Error('You cant peek a Stack that has no elements !');

//     return stack[stack.length - 1];
// }

/**
 * Takes a Reducers maps with multiple levels of nesting and turns it into in a single reducing function.
 * 
 * @param map An object whose values are either reducing functions or other objects
 * @param combineReducersFn combineReducers compatible function provided by your library of choice
 */
export function nestedCombineReducers<S = any, A extends Action = Action>(
    map: NestedReducersMap<S, A>,
    combineReducersFn: CombineReducersFn<S, A>
): Reducer<S, A> {

    if (!combineReducersFn) throw new Error('You must specify a combineReducers function.');
    if (!map) throw new Error('You must specify a reducers map.');

    const finalFlatMap: any = {};

    //Initialize manual Stack with initial values

    const manualStack: StackFrame[] = [
        {
            map,
            mapKeys: [],
            currentMapKey: null,
            currentMapKeyIndex: 0,
            flatMap: finalFlatMap,
            previousMapKey: null,
            previousFlatMap: {}
        }
    ];

    //We continue until the manual Stack is drained

    while (manualStack.length > 0) {

        const currentStackFrame = manualStack.pop();

        if (typeof currentStackFrame === 'undefined') throw new Error('Got an undefined Stack Frame !');

        currentStackFrame.mapKeys = Object.keys(currentStackFrame.map);

        for (let index = currentStackFrame.currentMapKeyIndex; index < currentStackFrame.mapKeys.length; index++) {

            currentStackFrame.currentMapKey = currentStackFrame.mapKeys[index];
            currentStackFrame.currentMapKeyIndex = index;

            console.log(index);

            const propValue = map[currentStackFrame.currentMapKey];

            if (propValue === null) continue;
            if (typeof propValue === 'undefined') continue;

            //Hopefully a reducer function, let's store it to combine it later

            if (typeof propValue === 'function') {
                currentStackFrame.flatMap[currentStackFrame.currentMapKey] = propValue;
            }

            //Nesting found, let's go deeper !

            if (typeof propValue === 'object') {

                //Let's prepare the next Stack Frame to "execute"

                const nextStackFrame: StackFrame = {
                    map: propValue,
                    mapKeys: [],
                    currentMapKey: null,
                    currentMapKeyIndex: 0,
                    flatMap: {},
                    previousMapKey: currentStackFrame.currentMapKey,
                    previousFlatMap: currentStackFrame.flatMap
                };

                //Keep this frame on the Stack as it has not finished yet
                
                manualStack.push(currentStackFrame);

                //But first run this frame

                manualStack.push(nextStackFrame);

                break;

            }

        }

        //If we have a previousMapKey it means that we left a previous execution incomplete
        //We have to update previousMapKey location so that the previous execution can resume back with the result

        if (currentStackFrame.previousMapKey) {

            currentStackFrame.previousFlatMap[currentStackFrame.previousMapKey] = combineReducersFn(currentStackFrame.flatMap);

        }

    }

    return combineReducersFn(finalFlatMap);

}