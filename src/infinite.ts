import { Reducer, Action, NestedReducersMap, CombineReducersFn } from "./types";

/**
 * The the element that will be returned when calling .pop() without removing it
 */
function peek<TElement>(stack: TElement[]): TElement {

    return stack[stack.length - 1];

}

/**
 * Execution data recorded to resume a partial execution later on
 */
interface StackFrame {

    /**
     * Input reducers map
     */
    map: object;

    /**
     * Output flattened reducers map that will be combined
     */
    flatMap: any;

    /**
     * Loop variable, keeps track of which index we are currently on
     */
    currentMapKeyIndex: number;

    /**
     * We don't have a way to suspend and resume execution to a particular line.
     * When an inner function call must return its value back to the caller we store where we should put the result.
     */
    previousFrameMapKey: string | null;

    /**
    * We don't have a way to suspend and resume execution to a particular line.
    * When an inner function call must return its value back to the caller we store the object where we will put the result.
    */
    previousFrameFlatMap: any;

    /**
     * Flag, when true the function call this Stack Frame represents was not completed.
     * When false the function was runned completely and we can execute the function return statement logic.
     */
    suspended: boolean;

}

/**
 * Takes a Reducers maps with multiple levels of nesting and turns it into in a single reducing function.
 * This version of the method replaces recursions with manual stack management, allowing insanely deep maps to be processed.
 * 
 * Beware: It is a lot more slow and memory intensive that the usual implementation.
 * 
 * @param map An object whose values are either reducing functions or other objects
 * @param combineReducersFn combineReducers compatible function provided by your library of choice
 */
export function infiniteNestedCombineReducers<S = any, A extends Action = Action>(
    map: NestedReducersMap<S, A>,
    combineReducersFn: CombineReducersFn<S, A>
): Reducer<S, A> {

    if (!combineReducersFn) throw new Error('You must specify a combineReducers function.');
    if (!map) throw new Error('You must specify a reducers map.');

    const finalFlatMap: any = {};

    //Initialize manual Stack with initial values
    //The initial frame will use the flatMap declared here as it will be the final result container

    const manualStack: StackFrame[] = [
        {
            map,
            currentMapKeyIndex: 0,
            flatMap: finalFlatMap,
            previousFrameMapKey: null,
            previousFrameFlatMap: {},
            suspended: false
        }
    ];

    //We continue until the manual Stack is drained

    while (manualStack.length > 0) {

        const currentStackFrame = peek(manualStack);

        currentStackFrame.suspended = false;

        const currentMapKeys = Object.keys(currentStackFrame.map);

        //Every frame resume starts after the previous loop of the cycle

        for (let index = currentStackFrame.currentMapKeyIndex; index < currentMapKeys.length; index++) {

            const currentMapKey = currentMapKeys[index];

            const propValue = currentStackFrame.map[currentMapKey];

            if (propValue === null) continue;
            if (typeof propValue === 'undefined') continue;

            //Hopefully a reducer function, let's store it to combine it later

            if (typeof propValue === 'function') {
                currentStackFrame.flatMap[currentMapKey] = propValue;
            }

            //Nesting found, let's go deeper !

            if (typeof propValue === 'object') {

                //Let's prepare the next Stack Frame to "execute"

                const nextStackFrame: StackFrame = {
                    map: propValue,
                    currentMapKeyIndex: 0,
                    flatMap: {},
                    previousFrameMapKey: currentMapKey,
                    previousFrameFlatMap: currentStackFrame.flatMap,
                    suspended: false
                };

                //Mark this frame on the Stack as suspended, because to complete its execution it must wai previous frames
                //When resuming we will skip right to the next cycle of the loop

                currentStackFrame.suspended = true;
                currentStackFrame.currentMapKeyIndex = index + 1;

                //Then run this new frame and interrupt the execution of the current one

                manualStack.push(nextStackFrame);

                break;

            }

        }

        //If we have a previousMapKey it means that we left a previous execution incomplete
        //We have to update previousMapKey location so that the previous execution can resume back with some results
        //We can only do that if this frame is not suspdended, if it is suspended it means that is waiting for some data

        if (currentStackFrame.previousFrameMapKey && !currentStackFrame.suspended) {

            currentStackFrame.previousFrameFlatMap[currentStackFrame.previousFrameMapKey] = combineReducersFn(currentStackFrame.flatMap);

        }

        //If this frame is not suspended we can destroy it because its execution is complete

        if (!currentStackFrame.suspended) {

            manualStack.pop();

        }

    }

    return combineReducersFn(finalFlatMap);

}