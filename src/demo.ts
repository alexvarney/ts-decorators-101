export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };

  const thing = new UsefulThing();

  element.addEventListener("click", () => {
    setCounter(counter + 1);
    thing.setProp(counter, "asdf");
  });
  setCounter(0);
}

type BaseFn = (...args: any[]) => any;

function LogProps<T extends BaseFn>(
  prefix: string,
  middleware: ((args: Parameters<T>) => void)[] = []
) {
  return (
    _: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): TypedPropertyDescriptor<T> => {
    const original = descriptor.value;

    descriptor.value = function (...args: Parameters<T>) {
      console.log(prefix, propertyKey, args);
      for (const fn of middleware) {
        fn(args);
      }
      original.apply(this, args);
    };

    return descriptor;
  };
}

export class UsefulThing {
  someProp: number;

  constructor() {
    this.someProp = 0;
  }

  @LogProps<UsefulThing["setProp"]>("some-prefix", [(args) => {}])
  @LogProps("another-thing")
  setProp(value: number, otherThing: string) {
    this.someProp = value;
  }
}
