export class ScrollController {
    private running = false;
  
    private element!: Element;
    private deltaScroll = 0;
    private deltaTime = 0;
    private steps = 0;
  
    public scrollTo(el: Element, scrollPos: number, time: number, pixelPerStep: number, smoothScrolling = true){
        this.element = el;
    
        const dist = scrollPos - (el.clientHeight + el.scrollTop);
        if(Math.abs(dist) <= 2 || !smoothScrolling){
            this.element.scrollTop = this.element.scrollHeight;
            return;
        }
    
        const calcSteps = Math.abs(dist) / pixelPerStep;
    
        if(calcSteps >= time) {
            const newPixelPerStep = Math.ceil(Math.abs(dist) / time);
            this.scrollTo(el, scrollPos, time, newPixelPerStep);
            return;
        }
    
        this.steps = calcSteps;
    
        this.deltaScroll = dist / this.steps;
        this.deltaTime = time / this.steps;
    
        if(!this.running){
            this.running = true;
            setTimeout(() => this.update());
        }
    
    }

    private update(){
        this.element.scrollTop += this.deltaScroll;
    
    
        this.steps--;
        if(this.steps >= 0){
            setTimeout(() => this.update(), this.deltaTime);
        }
        else {
            this.element.scrollTop = this.element.scrollHeight;
            this.running = false;
        }
    }

}