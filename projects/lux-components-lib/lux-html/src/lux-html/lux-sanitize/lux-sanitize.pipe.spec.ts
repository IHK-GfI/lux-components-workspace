import { TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { LuxSanitizePipe } from './lux-sanitize.pipe';

describe('LuxSanitizePipe', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        LuxSanitizePipe,
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: (ctx: any, val: string) => val,
            bypassSecurityTrustHtml: (val: string) => val
          }
        }
      ]
    });
  });

  it('create an instance', () => {
    const pipe = TestBed.inject(LuxSanitizePipe);

    expect(pipe).toBeTruthy();
  });

  it('script-Tag sollte entfernt worden sein', () => {
    const pipe = TestBed.inject(LuxSanitizePipe);
    const safeHtml = pipe.transform('<h1>Test</h1><script>alert("Gefahr!!!")</script><h2>Sub</h2>');

    expect(safeHtml).toEqual('<h1>Test</h1><h2>Sub</h2>');
  });

  it('bei leerer Config sollten die bösen Tags entfernt werden', () => {
    const pipe = TestBed.inject(LuxSanitizePipe);
    const safeHtml = pipe.transform('<h1>Test</h1><script>alert("Gefahr!!!")</script><h2>Sub</h2>', {});

    expect(safeHtml).toEqual('<h1>Test</h1><h2>Sub</h2>');
  });

  it('nur h1-Tags sollten erlaubt sein', () => {
    const pipe = TestBed.inject(LuxSanitizePipe);
    const safeHtml = pipe.transform('<h1>Test</h1><h2>Sub</h2><h3>SubSub</h3>', { allowedTags: ['h1'] });

    expect(safeHtml).toEqual('<h1>Test</h1>SubSubSub');
  });

  it('nur h1-Tags sollten verboten sein', () => {
    const pipe = TestBed.inject(LuxSanitizePipe);
    const safeHtml = pipe.transform('<h1>Test</h1><h2>Sub</h2><h3>SubSub</h3>', { forbiddenTags: ['h1'] });

    expect(safeHtml).toEqual('Test<h2>Sub</h2><h3>SubSub</h3>');
  });

  it('nur with-Attribute sollten erlaubt sein', () => {
    const pipe = TestBed.inject(LuxSanitizePipe);
    const safeHtml = pipe.transform('<h1>Test</h1><div width="100px" height="100px">Lorem ipsum</div>', {
      allowedAttrs: ['width']
    });

    expect(safeHtml).toEqual('<h1>Test</h1><div width="100px">Lorem ipsum</div>');
  });

  it('nur with-Attribute sollten verboten sein', () => {
    const pipe = TestBed.inject(LuxSanitizePipe);
    const safeHtml = pipe.transform('<h1>Test</h1><div width="100px" height="100px">Lorem ipsum</div>', {
      forbiddenAttrs: ['width']
    });

    expect(safeHtml).toEqual('<h1>Test</h1><div height="100px">Lorem ipsum</div>');
  });
});
