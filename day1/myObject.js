class Car{
    color;
    run(){
        console.log('RUN!!!');
    }
    info(){
        console.log('Color is '+ this.color);
    }
}

const c = new Car();
c.run();
c.color = 'yellow';
c.info();