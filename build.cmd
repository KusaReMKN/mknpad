FOR /r %%I IN (./src/*.ts) DO tsc --outFile ./js/%%~nI.js ./src/%%~nI.ts -t ES2017 
