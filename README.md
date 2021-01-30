![GitHub](https://img.shields.io/github/license/federico-paolillo/nested-combine-reducers?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/federico-paolillo/nested-combine-reducers?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/federico-paolillo/nested-combine-reducers/continuous-integration?label=CI&style=flat-square)  

# nested-combine-reducers

Allows you to create your root reducer in one go, instead of individually combine slice reducers.  

# Introduction

Tipically you divide your state tree in multiple slices, each handled by its own reducer.  
For example:

```javascript
const reducers = {
    ui: uiReducer,
    data: dataReducer
};
```
But if you want to further split your slices in even more slices you would have to do:

```javascript
const postsReducer = combineReducers({
    items: itemsReducer,
    favourites: favouritePostsReducer
});

const commentsReducer = ...;

const dataReducer = combineReducers({
    posts: postsReducer,
    comments: commentsReducer
});

const rootReducer = combineReducers({
    data: dataReducer,
});
```

As you can see you have to call `combineReducers` multiple times, *potentially losing the overview of your state shape*.  
In fact, from the example above, it is not immediately clear what the state shape looks like.  

This library tries to simplify the creation process of the root reducer by allowing to use a reducers map with nested reducing functions.  

The example above using `nestedCombineReducers` would become:

```javascript
const rootReducer = nestedCombineReducers({
    data: {
        posts: {
            items: itemsReducer,
            favourites: favouritePostsReducer
        },
        comments: ...
    }
});
```

Thanks to `nestedCombineReducers` it is immediately clear what the state shape looks like when your are creating your root reducer.  
You can also use `nestedCombineReducers` to create just a slice and then create the rest of your root reducer with `combineReducer`.  

# Usage

Simply pass your reducers map object to `nestedCombineReducers` to get back your root reducer, like so:  

```javascript
const rootReducer = nestedCombineReducers({
    data: {
        posts: {
            items: itemsReducer,
            favourites: favouritePostsReducer
        },
        comments: ...
    }
});
```

## With CommonJS

const { nestedCombineReducers } = require('nested-combine-reducers/cjs');

**Note:** Import from /cjs folder !

## With ES Modules

import { nestedCombineReducers } from 'nested-combine-reducers'

# Installation

**Note:** This library requires at least Redux 4. 

You can get `nestedCombineReducers` from NPM by running `npm install nested-combine-reducers`.  
The NPM package is hybrid, that means that you get both the ES Modules and the CommonJS version.  
`nestedCombineReducers` is written in TypeScript and typings are provided with the package.  
Frankly, I'm not a fan of having small utility functions installed as a dependency, therefore I suggest to simply copy/paste the function.  