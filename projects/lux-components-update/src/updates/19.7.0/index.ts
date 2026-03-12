import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { replaceRule } from '../../utility/files';
import { AddTransUnitItem } from '../../utility/replace-item';
import { finish, messageInfoRule, messageSuccessRule } from '../../utility/util';
import { Options } from '../19.0.0';

export function update190700(options: Options, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 19.7.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '19.7.0', false),
      updateMessages(options),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 19.7.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

function updateMessages(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const deFilePath = (options.path ?? '') + '/src/locale/messages.xlf';
    const enFilePath = (options.path ?? '') + '/src/locale/messages.en.xlf';

    const beforeId = `luxc.filter.title`;
    const deFilterButton = `<trans-unit id="luxc.consent.essential.name" datatype="html">
        <source>Notwendig</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">6</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.essential.hint" datatype="html">
        <source>Notwendige Cookies helfen dabei, eine Webseite nutzbar zu machen, indem sie Grundfunktionen wie Seitennavigation und Zugriff auf sichere Bereiche der Webseite ermöglichen. Die Webseite kann ohne diese Cookies nicht richtig funktionieren.</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">9</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.preferences.name" datatype="html">
        <source>Präferenzen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">13</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.preferences.hint" datatype="html">
        <source>Präferenz-Cookies ermöglichen einer Webseite sich an Informationen zu erinnern, die die Art beeinflussen, wie sich eine Webseite verhält oder aussieht, wie z. B. Ihre bevorzugte Sprache oder die Region in der Sie sich befinden.</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">16</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.statistics.name" datatype="html">
        <source>Statistiken</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">20</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.statistics.hint" datatype="html">
        <source>Statistik-Cookies helfen Webseiten-Besitzern zu verstehen, wie Besucher mit Webseiten interagieren, indem Informationen anonym gesammelt und gemeldet werden.</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">23</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.marketing.name" datatype="html">
        <source>Marketing</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">27</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.marketing.hint" datatype="html">
        <source>Marketing-Cookies werden verwendet, um Besuchern auf Webseiten zu folgen. Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen Benutzer sind und daher wertvoller für Publisher und werbetreibende Drittparteien sind.</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">30</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.other.name" datatype="html">
        <source>Nicht klassifiziert</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">34</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.other.hint" datatype="html">
        <source>Nicht klassifizierte Cookies sind Cookies, die wir gerade versuchen zu klassifizieren, zusammen mit Anbietern von individuellen Cookies.</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">37</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.link_back" datatype="html">
        <source>Zurück</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.hide_details" datatype="html">
        <source>Zurück</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.show_details" datatype="html">
        <source>Details</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.link_datenschutz" datatype="html">
        <source>Datenschutz</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.link_impressum" datatype="html">
        <source>Impressum</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_close" datatype="html">
        <source>Schließen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.title" datatype="html">
        <source>Standardhinweis</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.description" datatype="html">
        <source> Wir verwenden Cookies, um die Bereitstellung unserer Dienste zu erleichtern. Cookies sind kleine Textdateien, die von Webseiten verwendet werden, um die Benutzererfahrung effizienter zu gestalten. Laut Gesetz können wir Cookies auf Ihrem Gerät speichern, wenn diese für den Betrieb dieser Seite unbedingt notwendig sind. Für alle anderen Cookie-Typen benötigen wir Ihre Erlaubnis. Diese Seite verwendet unterschiedliche Cookie-Typen. Einige Cookies werden von Drittparteien platziert, die auf unseren Seiten erscheinen. Sie können Ihre Einwilligung jederzeit von der Cookie-Erklärung auf unserer Website ändern oder widerrufen. </source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,10</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.purposes_title" datatype="html">
        <source>Zweckarten</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.cookies_used_title" datatype="html">
        <source>Verwendete Cookies</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.table_header_name" datatype="html">
        <source>Name</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.table_header_duration" datatype="html">
        <source>Dauer</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.table_header_description" datatype="html">
        <source>Beschreibung</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_decline_optional" datatype="html">
        <source>Optionale ablehnen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_accept_selected" datatype="html">
        <source>Auswahl akzeptieren</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_accept_all" datatype="html">
        <source>Alle akzeptieren</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>`;
    const enFilterButton = `<trans-unit id="luxc.consent.essential.name" datatype="html">
        <source>Notwendig</source>
        <target>Essential</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">6</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.essential.hint" datatype="html">
        <source>Notwendige Cookies helfen dabei, eine Webseite nutzbar zu machen, indem sie Grundfunktionen wie Seitennavigation und Zugriff auf sichere Bereiche der Webseite ermöglichen. Die Webseite kann ohne diese Cookies nicht richtig funktionieren.</source>
        <target>Essential cookies help to make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">9</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.preferences.name" datatype="html">
        <source>Präferenzen</source>
        <target>Preferences</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">13</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.preferences.hint" datatype="html">
        <source>Präferenz-Cookies ermöglichen einer Webseite sich an Informationen zu erinnern, die die Art beeinflussen, wie sich eine Webseite verhält oder aussieht, wie z. B. Ihre bevorzugte Sprache oder die Region in der Sie sich befinden.</source>
        <target>Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">16</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.statistics.name" datatype="html">
        <source>Statistiken</source>
        <target>Statistics</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">20</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.statistics.hint" datatype="html">
        <source>Statistik-Cookies helfen Webseiten-Besitzern zu verstehen, wie Besucher mit Webseiten interagieren, indem Informationen anonym gesammelt und gemeldet werden.</source>
        <target>Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">23</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.marketing.name" datatype="html">
        <source>Marketing</source>
        <target>Marketing</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">27</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.marketing.hint" datatype="html">
        <source>Marketing-Cookies werden verwendet, um Besuchern auf Webseiten zu folgen. Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen Benutzer sind und daher wertvoller für Publisher und werbetreibende Drittparteien sind.</source>
        <target>Marketing cookies are used to track visitors across websites. The intention is to show ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">30</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.other.name" datatype="html">
        <source>Nicht klassifiziert</source>
        <target>Unclassified</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">34</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.other.hint" datatype="html">
        <source>Nicht klassifizierte Cookies sind Cookies, die wir gerade versuchen zu klassifizieren, zusammen mit Anbietern von individuellen Cookies.</source>
        <target>Unclassified cookies are cookies that we are in the process of classifying, together with the providers of individual cookies.</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-categories.ts</context>
          <context context-type="linenumber">37</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.link_back" datatype="html">
        <source>Zurück</source>
        <target>Back</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.hide_details" datatype="html">
        <source>Zurück</source>
        <target>Back</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.show_details" datatype="html">
        <source>Details</source>
        <target>Details</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.link_datenschutz" datatype="html">
        <source>Datenschutz</source>
        <target>Privacy Policy</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.link_impressum" datatype="html">
        <source>Impressum</source>
        <target>Legal Notice</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_close" datatype="html">
        <source>Schließen</source>
        <target>Close</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.title" datatype="html">
        <source>Standardhinweis</source>
        <target>Default Notice</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.description" datatype="html">
        <source> Wir verwenden Cookies, um die Bereitstellung unserer Dienste zu erleichtern. Cookies sind kleine Textdateien, die von Webseiten verwendet werden, um die Benutzererfahrung effizienter zu gestalten. Laut Gesetz können wir Cookies auf Ihrem Gerät speichern, wenn diese für den Betrieb dieser Seite unbedingt notwendig sind. Für alle anderen Cookie-Typen benötigen wir Ihre Erlaubnis. Diese Seite verwendet unterschiedliche Cookie-Typen. Einige Cookies werden von Drittparteien platziert, die auf unseren Seiten erscheinen. Sie können Ihre Einwilligung jederzeit von der Cookie-Erklärung auf unserer Website ändern oder widerrufen. </source>
        <target> We use cookies to facilitate the provision of our services. Cookies are small text files that are used by websites to make the user experience more efficient. By law, we can store cookies on your device if they are strictly necessary for the operation of this site. For all other types of cookies, we need your permission. This site uses different types of cookies. Some cookies are placed by third parties who appear on our pages. You can change or withdraw your consent at any time from the cookie declaration on our website. </target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,10</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.purposes_title" datatype="html">
        <source>Zweckarten</source>
        <target>Purpose types</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.cookies_used_title" datatype="html">
        <source>Verwendete Cookies</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.table_header_name" datatype="html">
        <source>Name</source>
        <target>Name</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.table_header_duration" datatype="html">
        <source>Dauer</source>
        <target>Duration</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.table_header_description" datatype="html">
        <source>Beschreibung</source>
        <target>Description</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_decline_optional" datatype="html">
        <source>Optionale ablehnen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_accept_selected" datatype="html">
        <source>Auswahl akzeptieren</source>
        <target>Accept selected</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.consent.button_accept_all" datatype="html">
        <source>Alle akzeptieren</source>
        <target>Accept all</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-consent/lux-consent-dialog.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>`;

    return chain([
      replaceRule(
        options,
        `Messages (de) werden angepasst...`,
        `Messages (de) wurden angepasst.`,
        deFilePath,
        new AddTransUnitItem(beforeId, deFilterButton)
      ),

      replaceRule(
        options,
        `Messages (en) werden angepasst...`,
        `Messages (en) wurden angepasst.`,
        enFilePath,
        new AddTransUnitItem(beforeId, enFilterButton)
      )
    ]);
  };
}
