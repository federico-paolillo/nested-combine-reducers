[![MIT License](https://img.shields.io/github/license/federico-paolillo/nested-combine-reducers.svg?style=flat-square)](https://github.com/federico-paolillo/nested-combine-reducers/blob/master/LICENSE)
[![Travis branch](https://img.shields.io/travis/federico-paolillo/nested-combine-reducers/master.svg?style=flat-square)](https://travis-ci.org/federico-paolillo/nested-combine-reducers)
[![NPM](https://img.shields.io/npm/v/nested-combine-reducers.svg?style=flat-square)](https://www.npmjs.com/package/nested-combine-reducers)

# nested-combine-reducers

Adds support for nesting in any compatible combineReducers function.  
No dependencies and no assumptions on which Redux-like library you are using.  

# Why ?

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

As you can see you have to call manually `combineReducers` multiple times, *potentially losing the overview of your state shape*.  
In fact from the example above it is not immediately clear what the state shape looks like.  
This library tries to simplify this workflow by allowing you to use directly a reducers map with nested reducing functions.  

The example above with nestedCombineReducers would become:

```javascript
const rootReducer = nestedCombineReducers({
    data: {
        posts: {
            items: itemsReducer,
            favourites: favouritePostsReducer
        },
        comments: ...
    }
}, combineReducers);
```

With `nestedCombineReducers` it should be a bit more clear what the state shape looks like when your are creating the root reducer or any slice reducer.  

You can also use `nestedCombineReducers` to create a slice reducer that will be combined in a root reducer with the usual combineReducers.  
nestedCombineReducers is not meant to be used only to create the root reducer.  

# Requirements

Minimum ECMAScript version required is ECMAScript 2015 (ES6).  
Provides typings for Typescript and it is also written in Typescript.  

# How do I use it ?

Import *nestedCombineReducers* from 'nested-combine-reducers'.  
Import a combineReducers function from some library.  
Call `nestedCombineReducers` passing in your reducers map and your combineReducers function.  

Code example using ECMAScript 2015 (ES6) modules:

```javascript
import { combineReducers } from 'redux';
import { nestedCombineReducers } from 'nested-combine-reducers';

const someNestedReducersMap = {
    ui: {
        spinner: spinnerReducer
    },
    data: {
        posts: {
            items: postItemsReducer,
            favourites: favouritePostsReducer
        },
        comments: {
            ...
        }
    }
}

const rootReducer = nestedCombineReducers(someNestedReducersMap, combineReducers);
```

Code example using CommonJS:

```javascript
const { combineReducers } = require('redux');
const { nestedCombineReducers } = require('nested-combine-reducers');

const someNestedReducersMap = {
    ui: {
        spinner: spinnerReducer
    },
    data: {
        posts: {
            items: postItemsReducer,
            favourites: favouritePostsReducer
        },
        comments: {
            ...
        }
    }
}

const rootReducer = nestedCombineReducers(someNestedReducersMap, combineReducers);
```

# Limitations

Circular references in the reducers map will eventually lead to a stack overflow or memory overflow.  
Usually having circular references in your state tree is not supported by any Redux like library that I know of, so there shouldn't be any problems.

#Infinite depth

This library exposes an `infinteCombineReducers` utility that is capable of handling very large and deeply nested reducer maps.  
Although I find it questionable to have reducer maps *that* big, it was a fun exercise to implement.  
The implementation is identical and rewrites the recursion using loops and manual stack management.

There should never be a reason to use this version as you should never have structures that big.
Note that the iterative version is slower that the traditional version [as you can see here](https://jsperf.com/rvnrcombo/).