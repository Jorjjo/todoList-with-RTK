import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { App } from './app/App';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
);

export function updateArray<T>(array: T[], val: T): T[] {
    const hehe = array.find((item) => item === val);

    if (!hehe) {
        return [...array, val];
    }
    return array;
}

// Строки
const stringArray = ['apple', 'banana', 'cherry'];
console.log(updateArray(stringArray, 'banana')); // ['apple', 'banana', 'cherry']
console.log(updateArray(stringArray, 'strawberry')); // ['apple', 'banana', 'cherry', 'strawberry']

// Числа
const numberArray = [1, 2, 3];
console.log(updateArray(numberArray, 2)); // [1, 2, 3]
console.log(updateArray(numberArray, 4)); // [1, 2, 3, 4]
