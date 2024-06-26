<template>
  <div id="app">
    <h1>Datepicker Examples</h1>
    <div class="example">
      <h3>Default datepicker...</h3>
      <datepicker placeholder="Select Date" />
      <code>
        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Datepicker with footer</h3>
      <datepicker
        placeholder="Type or select date"
        :show-footer="true"
      />
      <code>
        &lt;datepicker placeholder="Type or select date" :show-footer="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Typeable datepicker</h3>
      <datepicker
        placeholder="Type or select date"
        :typeable="true"
      />
      <code>
        &lt;datepicker placeholder="Type or select date" :typeable="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Modal datepicker</h3>
      <datepicker
        placeholder="Select date"
        :modal="true"
      />
      <code>
        &lt;datepicker placeholder="Select date" :modal="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Bootstrap styled datepicker</h3>
      <datepicker
        :bootstrap-styling="true"
        :calendar-button="true"
        :clear-button="true"
      />
      <code>
        &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>v-model datepicker</h3>
      <datepicker
        v-model="vModelExample"
        placeholder="Select Date"
      />
      <code>
        &lt;datepicker placeholder="Select Date" v-model="vmodelexample"&gt;&lt;/datepicker&gt;
      </code>
      <hr>
      <p>{{ vModelExample }}</p>
    </div>

    <div class="example">
      <h3>Format datepicker</h3>
      <datepicker :format="format" />
      <code>
        &lt;datepicker :format="format"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Format</label>
          <select v-model="format">
            <option
              value="d MMM yyyy"
              selected
            >
              d MMM yyyy - e.g 12 Feb 2016
            </option>
            <option value="d MMMM yyyy">
              d MMMM yyyy - e.g 12 February 2016
            </option>
            <option value="yyyy-MM-dd">
              yyyy-MM-dd - e.g 2016-02-12
            </option>
            <option value="dsu MMM yyyy">
              dsu MMM yyyy - e.g 12th Feb 2016
            </option>
            <option value="D dsu MMM yyyy">
              D dsu MMM yyyy - e.g Sat 12th Feb 2016
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="example">
      <h3>With minimum and maximum date range</h3>
      <datepicker :disabled-dates="disabledDates" />
      <code>
        &lt;datepicker :disabledDates="disabledDates"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled to:</label>
          <datepicker @selected="disableTo" />
        </div>
        <div class="form-group">
          <label>Disabled from:</label>
          <datepicker @selected="disableFrom" />
        </div>
        <div class="form-group">
          <label>Disabled Days of Month:</label>
          <input
            type="text"
            value=""
            placeholder="5,6,12,13"
            @change="setDisabledDays"
          >
        </div>
        <pre>disabled: {{ disabledDates }}</pre>

        <h5>Resulting Date picker</h5>
        <datepicker :disabled-dates="disabledDates" />
      </div>
    </div>

    <div class="example">
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled Function:</label>
        </div>
        <pre>
          disabledDates: {
            customPredictor: function (date) {
              // disables every day of a month which is a multiple of 3
              if (date.getDate() % 3 === 0) {
                return true
              }
            }
          }
        </pre>
        <h5>Resulting Date picker</h5>
        <datepicker :disabled-dates="disabledFn" />
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates Matching Given Function</h3>
      <datepicker :highlighted="highlighted" />
      <code>
        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <pre>
          highlighted: {
            customPredictor: function (date) {
              // highlights every day of a month which is a multiple of 4
              if (date.getDate() % 4 === 0) {
                return true
              }
            }
          }
        </pre>

        <h5>Resulting Date picker</h5>
        <datepicker :highlighted="highlightedFn" />
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates</h3>
      <code>
        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Highlight from:</label>
          <datepicker @selected="highlightFrom" />
        </div>
        <div class="form-group">
          <label>Highlight to:</label>
          <datepicker @selected="highlightTo" />
        </div>
        <div class="form-group">
          <label>Highlight Days of Month:</label>
          <input
            type="text"
            value=""
            @change="setHighlightedDays"
          >
        </div>
        <pre>highlighted: {{ highlighted }}</pre>

        <h5>Resulting Date picker</h5>
        <datepicker :highlighted="highlighted" />
      </div>
    </div>

    <div class="example">
      <h3>With default open date</h3>
      <datepicker :open-date="openDate" />
      <code>
        &lt;datepicker :disabled="disabled"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Open date:</label>
          <datepicker v-model="openDate" />
        </div>
        <pre>openDate: {{ openDate }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Translations</h3>
      <h5>{{ languages[language].language }} datepicker</h5>

      <datepicker
        :language="languages[language]"
        format="d MMMM yyyy"
      />
      <code>
        &lt;datepicker :language="languages.{{ language }}"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="language">
          <option
            v-for="(language, key) in languages"
            :key="key"
            :value="key"
          >
            {{ language.language }}
          </option>
        </select>
      </div>
    </div>

    <div class="example">
      <h3>Inline datepicker</h3>
      <datepicker :inline="true" />
      <code>
        &lt;datepicker :inline="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Inline datepicker side-by-side</h3>
      <datepicker
        :inline="true"
        :side-by-side="true"
      />
      <code>
        &lt;datepicker :inline="true" :side-by-side="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>RTL datepicker</h3>
      <datepicker :language="languages.he" />
      <code>
        &lt;datepicker :language="languages.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only</h3>
      <datepicker
        :minimum-view="'day'"
        :maximum-view="'day'"
      />
      <code>
        &lt;datepicker :minimumView="'day'" :maximumView="'day'"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only RTL</h3>
      <datepicker
        :minimum-view="'day'"
        :maximum-view="'day'"
        :language="languages.he"
      />
      <code>
        &lt;datepicker :minimumView="'day'" :maximumView="'day'" language="languages.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Month view only</h3>
      <datepicker
        :minimum-view="'month'"
        :maximum-view="'month'"
      />
      <code>
        &lt;datepicker :minimumView="'month'" :maximumView="'month'"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day and month view only</h3>
      <datepicker
        :minimum-view="'day'"
        :maximum-view="'month'"
        :initial-view="'month'"
      />
      <code>
        &lt;datepicker :minimumView="'day'" :maximumView="'month'" :initialView="'month'"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Year and month view only</h3>
      <datepicker
        :minimum-view="'month'"
        :maximum-view="'year'"
        :initial-view="'year'"
      />
      <code>
        &lt;datepicker :minimumView="'month'" :maximumView="'year'" :initialView="'year'"&gt;&lt;/datepicker&gt;
      </code>
    </div>
  </div>
</template>

<script>
import Datepicker from '../src/components/Datepicker.vue';
import * as lang from '../src/locale/index.js';

const state = {
  date1: new Date(),
};

export default {
  name: 'DatepickerDemo',
  components: {
    Datepicker,
  },
  data () {
    return {
      styleInput: null,
      format: 'd MMMM yyyy',
      disabledDates: {},
      openDate: null,
      disabledFn: {
        customPredictor (date) {
          if (date.getDate() % 3 === 0) {
            return true;
          }
        },
      },
      highlightedFn: {
        customPredictor (date) {
          if (date.getDate() % 4 === 0) {
            return true;
          }
        },
      },
      highlighted: {},
      eventMsg: null,
      state: state,
      vModelExample: null,
      languages: lang,
      language: 'en',
    };
  },
  computed: {
    getInputStyle () {
      return this.styleInput;
    },
  },
  methods: {
    highlightTo (val) {
      if (typeof this.highlighted.to === 'undefined') {
        this.highlighted = {
          to: null,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: this.highlighted.from,
        };
      }
      this.highlighted.to = val;
    },
    highlightFrom (val) {
      if (typeof this.highlighted.from === 'undefined') {
        this.highlighted = {
          to: this.highlighted.to,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: null,
        };
      }
      this.highlighted.from = val;
    },
    setHighlightedDays (elem) {
      if (elem.target.value === 'undefined') {
        return;
      }
      let highlightedDays = elem.target.value.split(',').map(day => parseInt(day));
      this.highlighted = {
        from: this.highlighted.from,
        to: this.highlighted.to,
        daysOfMonth: highlightedDays,
      };
    },
    setDisabledDays (elem) {
      if (elem.target.value === 'undefined') {
        return;
      }
      let disabledDays = elem.target.value.split(',').map(day => parseInt(day));
      this.disabledDates = {
        from: this.disabledDates.from,
        to: this.disabledDates.to,
        daysOfMonth: disabledDays,
      };
    },
    disableTo (val) {
      if (typeof this.disabledDates.to === 'undefined') {
        this.disabledDates = {
          to: null,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: this.disabledDates.from,
        };
      }
      this.disabledDates.to = val;
    },
    disableFrom (val) {
      if (typeof this.disabledDates.from === 'undefined') {
        this.disabledDates = {
          to: this.disabledDates.to,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: null,
        };
      }
      this.disabledDates.from = val;
    },
  },
};
</script>

<style>

@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

body {
    font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
    padding: 1em 2em 2em;
}
input, select {
    padding: .75em .5em;
    font-size: 100%;
    border: 1px solid #ccc;
    width: 100%
}

select {
    height: 3em;
}

.example {
    background: #f2f2f2;
    border: 1px solid #ddd;
    padding: 0em 1em 1em;
    margin-bottom: 2em;
}

code,
pre {
    margin: 1em 0;
    padding: 1em;
    border: 1px solid #bbb;
    display: block;
    background: #ddd;
    border-radius: 3px;
}

.settings {
    margin: 2em 0;
    border-top : 1px solid #bbb;
    background: #eee;
}

h5 {
    font-size:100%;
    padding: 0;
}

.form-group {
    margin-bottom: 1em;
}

.form-group label {
    font-size: 80%;
    display: block;
}
</style>
