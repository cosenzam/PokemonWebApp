import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

/*
function doSomething(){
  for (var i = 0; i < 5; i++){
    console.log(i)
  }

  console.log('Finally: ' + i);
}

doSomething();

// type annotation
let a: number;
//a = 'a'

// b is any type, but use type annotation to avoid problems from changing types
let b;
b = 1;
b = 'b';
b = true;

let e: number[] = [1, 2, 3];

const colorRed = 0;
const colorGreen = 1;
const colorBlue = 2;

// readability with enum
enum Color { Red = 0, Green = 1, Blue = 2 };
let backgroundColor = Color.Red;

let message;
message = 'abc';
console.log(typeof(message));
// type assertion
let endsWithC = (<string> message).endsWith('c');
let alternativeWay = (message as string).endsWith('c');

// arrow functions
let log = function(message: string) {
  console.log(message);
}

let doLog = (message: string) => {
  console.log(message);
}

//can be shorter if code is only one line
let doLogShortened = (message: string) => console.log(message);

let drawPoint = (point: {x: number, y: number}) => {
  console.log(point.x + ", " + point.y);
}

drawPoint({
  x: 1,
  y: 2
})


class Point {
  // fields not necesary when using typescript constructors, can add access modifiers to constructor and delete below lines and this.x/this.y
  private _x?: number;
  private _y?: number;

  constructor(_x?: number, _y?: number) {
    this._x = _x;
    this._y = _y;
  }

  draw() {
    console.log("x: " + this._x + " y: " + this._y);
  }

  get x(){
    if (this._x === undefined){
      return 0;
    }
    else{
      return this._x;
    }
  }

  set x(value: number){
    if (value < 0)
      throw new Error('value cannot be less than 0.');
    this._x = value;
  }

}
 
const point = new Point(1, 2);
//point.x = 3; // not accesible because properties are private
point.draw();
let x = point.x;
point.x = 10;
console.log(point.x);


interface Person {
  name: string,
  age: number;
}

function greet(person: Person) {
  console.log("Hello " + person.name + ", " + person.age);
}

greet({name: "Michael",age: 23})

interface PaintOptions {
  shape: string;
  xPos?: number;
  yPos?: number;
}
 
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  // conditional(if opts.xPos is und) ->  if true xPos = 0 : if false xPos = opts.xPos
       
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;

  console.log(xPos);
  console.log(yPos);
  
}
 
const shape = "circle";
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
*/