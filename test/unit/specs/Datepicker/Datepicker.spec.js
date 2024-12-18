import Datepicker from '@/components/Datepicker.vue';
import DateInput from '@/components/DateInput.vue';
import { shallowMount, mount } from '@vue/test-utils';
import { makeDateUtils } from '@/utils/DateUtils';
import { en } from '@/locale';

const constructedDateUtils = makeDateUtils(true);

describe('Datepicker unmounted', () => {
  it('has a mounted hook', () => {
    expect(typeof Datepicker.mounted).toEqual('function');
  });

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).toEqual('function');
    const defaultData = Datepicker.data();
    expect(defaultData.selectedDate).toEqual(null);
    expect(defaultData.showDayView).toEqual(false);
    expect(defaultData.showMonthView).toEqual(false);
    expect(defaultData.showYearView).toEqual(false);
    expect(defaultData.calendarHeight).toEqual(0);
  });
});

describe('Datepicker mounted', () => {
  let wrapper;
  let date;
  beforeEach(() => {
    date = new Date(2016, 1, 15);
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        modelValue: date,
      },
    });
  });

  it('correctly sets the value when created', () => {
    expect(wrapper.vm.modelValue).toEqual(date);
  });

  it('correctly sets the value from method', () => {
    const newDate = new Date(2016, 9, 15);
    expect(typeof wrapper.vm.setValue).toEqual('function');
    wrapper.vm.setValue(newDate);
    expect(wrapper.vm.selectedDate).toEqual(newDate);
    const now = new Date();
    wrapper.vm.setValue();
    expect(wrapper.vm.selectedDate).toEqual(null);
    const pageDate = new Date(wrapper.vm.pageDate);
    expect(pageDate.getFullYear()).toEqual(now.getFullYear());
    expect(pageDate.getMonth()).toEqual(now.getMonth());
    expect(pageDate.getDate()).toEqual(1);
  });

  it('correctly sets the focusedDate when setting the value from method', async () => {
    const newDate = new Date(2016, 9, 15);
    const newDateTs = newDate.getTime();
    await wrapper.setData({
      focusedDate: null,
    });
    expect(wrapper.vm.focusedDate).toBeNull();
    wrapper.vm.setValue(newDate);
    expect(wrapper.vm.focusedDate).toEqual(newDateTs);
  });

  it('sets the date', () => {
    const date = new Date(2016, 9, 9);
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
      },
    });
    wrapper.vm.setDate(date.getTime());
    expect(wrapper.vm.selectedDate.getTime()).toEqual(date.getTime());
  });

  it('sets the focusedDate when setting the date', async () => {
    const date = new Date(2016, 9, 9);
    const newDateTs = date.getTime();
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
      },
    });
    await wrapper.setData({
      focusedDate: null,
    });
    expect(wrapper.vm.focusedDate).toBeNull();
    wrapper.vm.setDate(newDateTs);
    expect(wrapper.vm.focusedDate).toEqual(newDateTs);
  });

  it('changes the page date when selecting a date from a different month', () => {
    const initialDate = new Date(Date.UTC(2016, 8, 9));
    const date = new Date(Date.UTC(2016, 9, 9));
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        openDate: initialDate,
      },
    });
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 8, 1)));
    wrapper.vm.setDate(date.getTime());
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 9, 1)));
  });

  it('does not change the page when selecting a date in the same month', () => {
    const initialDate = new Date(Date.UTC(2016, 8, 9));
    const date = new Date(Date.UTC(2016, 8, 11));
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        openDate: initialDate,
      },
    });
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 8, 1)));
    wrapper.vm.setDate(date.getTime());
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 8, 1)));
  });

  it('does not change the page when selecting a date in the next month for a side-by-side layout', () => {
    const initialDate = new Date(Date.UTC(2016, 8, 9));
    const date = new Date(Date.UTC(2016, 9, 11));
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        openDate: initialDate,
        sideBySide: true,
      },
    });
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 8, 1)));
    wrapper.vm.setDate(date.getTime());
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 8, 1)));
  });

  it('changes the page when selecting a date in a different month for a side-by-side layout', () => {
    const initialDate = new Date(Date.UTC(2016, 8, 9));
    const date = new Date(Date.UTC(2016, 7, 11));
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        openDate: initialDate,
        sideBySide: true,
      },
    });
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 8, 1)));
    wrapper.vm.setDate(date.getTime());
    expect(wrapper.vm.pageDate).toEqual(new Date(Date.UTC(2016, 7, 1)));
  });

  it('clears the date', () => {
    const date = new Date(2016, 9, 9);
    const wrapper = shallowMount(Datepicker);
    wrapper.vm.setDate(date.getTime());
    wrapper.vm.clearDate();
    expect(wrapper.vm.selectedDate).toEqual(null);
  });

  it('should set pageTimestamp to be now', () => {
    const data = Datepicker.data();
    const d = new Date(data.pageTimestamp);
    expect(d.getFullYear()).toEqual(new Date().getFullYear());
    expect(d.getMonth()).toEqual(new Date().getMonth());
    expect(d.getDate()).toEqual(1);
  });

  it('should open and close the calendar', async () => {
    wrapper.vm.close();
    expect(wrapper.vm.isOpen).toEqual(false);

    wrapper.vm.showMonthCalendar();
    expect(wrapper.vm.isOpen).toEqual(true);

    wrapper.vm.close();
    expect(wrapper.vm.isOpen).toEqual(false);

    wrapper.vm.showYearCalendar();
    expect(wrapper.vm.isOpen).toEqual(true);

    wrapper.vm.close();
    expect(wrapper.vm.isOpen).toEqual(false);

    wrapper.vm.showDayCalendar();
    expect(wrapper.vm.isOpen).toEqual(true);
    // calendar is already open so acts as a toggle
    await wrapper.vm.showCalendar();
    expect(wrapper.vm.isOpen).toEqual(false);
  });

  it('should emit selectedDisabled on a disabled timestamp', () => {
    const date = new Date(2016, 9, 1);
    wrapper.vm.selectDisabledDate({ timestamp: date.getTime() });
    expect(wrapper.emitted().selectedDisabled).toBeTruthy();
  });

  it('can select a day', () => {
    const date = new Date(2016, 9, 1);
    wrapper.vm.selectDate({ timestamp: date.getTime() });
    expect(wrapper.vm.pageTimestamp).toEqual(date.getTime());
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(9);
    expect(wrapper.vm.showDayView).toEqual(false);
    expect(wrapper.emitted().selected).toBeTruthy();
  });

  it('can select a month', () => {
    const date = new Date(2016, 9, 9);
    wrapper.vm.selectMonth({ timestamp: date.getTime() });
    expect(wrapper.emitted().changedMonth).toBeTruthy();
    expect(wrapper.emitted().changedMonth[0][0].timestamp).toEqual(date.getTime());
    expect(new Date(wrapper.vm.pageTimestamp).getMonth()).toEqual(date.getMonth());
    expect(wrapper.vm.showDayView).toEqual(true);
  });

  it('can select a year', () => {
    const date = new Date(2018, 9, 9);
    wrapper.vm.selectYear({ timestamp: date.getTime() });
    expect(wrapper.emitted().changedYear).toBeTruthy();
    expect(wrapper.emitted().changedYear[0][0].timestamp).toEqual(date.getTime());
    expect(new Date(wrapper.vm.pageTimestamp).getFullYear()).toEqual(date.getFullYear());
    expect(wrapper.vm.showMonthView).toEqual(true);
  });

  it('sets the date on typedDate event', () => {
    const wrapper = shallowMount(Datepicker);
    const today = new Date();
    wrapper.vm.setTypedDate(today);
    expect(wrapper.vm.selectedDate).toEqual(today);
  });

  it('watches value', async () => {
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        modelValue: '2018-01-01',
      },
    });
    const spy = jest.spyOn(wrapper.vm, 'setValue');
    await wrapper.setProps({
      modelValue: '2018-04-26',
    });
    expect(spy).toBeCalled();
  });

  it('watches openDate', async () => {
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        openDate: new Date(2018, 0, 1),
      },
    });
    const spy = jest.spyOn(wrapper.vm, 'setPageDate');
    await wrapper.setProps({
      openDate: new Date(2018, 3, 26),
    });
    expect(spy).toBeCalled();
  });

  it('watches initialView', async () => {
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'day',
      },
    });
    const spy = jest.spyOn(wrapper.vm, 'setInitialView');
    await wrapper.setProps({
      initialView: 'month',
    });
    expect(spy).toBeCalled();
  });

  it('should emit changedMonth on a month change received from PickerDay', () => {
    const date = new Date(2016, 9, 1);
    wrapper.vm.handleChangedMonthFromDayPicker({ timestamp: date.getTime() });
    expect(wrapper.emitted().changedMonth).toBeTruthy();
  });

  it('should emit highlight-date', () => {
    wrapper.vm.highlightDate({ timestamp: 100 });
    expect(wrapper.emitted()['highlight-date']).toBeTruthy();
    expect(wrapper.emitted()['highlight-date'][0]).toEqual([ { timestamp: 100 } ]);
  });
});

describe('Datepicker.vue set by string', () => {
  let wrapper;
  it('can parse a string date', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        modelValue: '2016-02-20',
      },
    });
    const date = new Date('2016-02-20');
    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(date.getFullYear());
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(date.getMonth());
    expect(wrapper.vm.selectedDate.getDate()).toEqual(date.getDate());
  });

  it('should nullify malformed value', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        modelValue: 'today',
      },
    });
    expect(wrapper.vm.selectedDate).toBeNull();
  });
});

describe('Datepicker.vue set by timestamp', () => {
  let wrapper;
  it('can parse unix timestamp', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        modelValue: new Date(Date.UTC(2018, 0, 29)).getTime(),
      },
    });
    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(2018);
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(0);
    expect(wrapper.vm.selectedDate.getDate()).toEqual(29);
  });
});

describe('Datepicker.vue using UTC', () => {
  let wrapper;
  it('correctly sets the value using UTC', done => {
    const timezoneOffset = ((new Date()).getTimezoneOffset() / 60);

    // this is ambiguous because localzone differs by one day than UTC
    const ambiguousHour = 25 - timezoneOffset;
    const ambiguousDate = new Date(2018, 3, 15, ambiguousHour);
    const ambiguousYear = ambiguousDate.getUTCFullYear();
    const ambiguousMonth = (`0${ambiguousDate.getUTCMonth() + 1}`).slice(-2);
    const ambiguousDay = (`0${ambiguousDate.getUTCDate()}`).slice(-2);
    const UTCString = `${ambiguousYear} ${ambiguousMonth} ${ambiguousDay}`;

    // It's important to use the `mount` helper here
    wrapper = mount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        modelValue: ambiguousDate,
        useUtc: true, // This should fail if `useUtc=false`
      },
    });
    // It's important to assert the input rendered output
    wrapper.vm.$nextTick(() => {
      expect(wrapper.findComponent(DateInput).vm.formattedValue).toEqual(UTCString);
      done();
    });
  });
});

describe('Datepicker with initial-view', () => {
  let wrapper;
  it('should open in Day view', async () => {
    wrapper = shallowMount(Datepicker);
    await wrapper.vm.showCalendar();
    expect(wrapper.vm.computedInitialView).toEqual('day');
    expect(wrapper.vm.showDayView).toEqual(true);
    expect(wrapper.vm.showMonthView).toEqual(false);
    expect(wrapper.vm.showYearView).toEqual(false);
  });

  it('should open in Month view', async () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'month',
      },
    });
    await wrapper.vm.showCalendar();
    expect(wrapper.vm.computedInitialView).toEqual('month');
    expect(wrapper.vm.showDayView).toEqual(false);
    expect(wrapper.vm.showMonthView).toEqual(true);
    expect(wrapper.vm.showYearView).toEqual(false);
  });

  it('should open in Year view', async () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'year',
      },
    });
    await wrapper.vm.showCalendar();
    expect(wrapper.vm.computedInitialView).toEqual('year');
    expect(wrapper.vm.showDayView).toEqual(false);
    expect(wrapper.vm.showMonthView).toEqual(false);
    expect(wrapper.vm.showYearView).toEqual(true);
  });
});

describe('Focus after opening the datepicker', () => {
  describe('Days', () => {
    it('should focus on the current day', async () => {
      const wrapper = mount(Datepicker, { attachTo: document.body });
      const today = new Date();
      await wrapper.vm.showCalendar();
      expect(document.activeElement.textContent.trim()).toEqual(today.getDate().toString());
    });
  });
  describe('Months', () => {
    it('should focus on the current month', async () => {
      const wrapper = mount(Datepicker, {
        propsData: {
          minimumView: 'month',
        },
        attachTo: document.body,
      });
      const today = new Date();
      await wrapper.vm.showCalendar();
      expect(document.activeElement.textContent.trim()).toEqual(constructedDateUtils.getMonthName(today, en.months));
    });
  });
  describe('Years', () => {
    it('should focus on the current year', async () => {
      const wrapper = mount(Datepicker, {
        propsData: {
          minimumView: 'year',
        },
        attachTo: document.body,
      });
      const today = new Date();
      await wrapper.vm.showCalendar();
      expect(document.activeElement.textContent.trim()).toEqual(today.getFullYear().toString());
    });
  });
});

// TODO: reenable later if Chromium-based browsers issue is fixed
// describe('Focus after closing the datepicker', () => {
//   it('should focus on the input', async () => {
//     const wrapper = mount(Datepicker, { attachTo: document.body });
//     await wrapper.vm.showCalendar();
//     wrapper.vm.close(true);
//     const input = wrapper.vm.$refs.input.$el.querySelector('input');
//     expect(document.activeElement).toEqual(input);
//   });
//   describe('after scrolling and clicking outside', () => {
//     let wrapper;
//     let originalGetBoundingClientRect;
//     beforeEach(() => {
//       wrapper = mount(Datepicker, { attachTo: document.body });
//       originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
//     });
//     afterEach(() => {
//       Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
//       wrapper.unmount();
//     });

//     it('should focus on the input when it is in viewport', async () => {
//       Element.prototype.getBoundingClientRect = jest.fn(() => ({
//         top: 100,
//         bottom: 0,
//         left: 0,
//         right: 0,
//       }));
//       await wrapper.vm.showCalendar();
//       wrapper.vm.clickOutside({ target: document.body });
//       const input = wrapper.vm.$refs.input.$el.querySelector('input');
//       expect(document.activeElement).toEqual(input);
//     });

//     it('should not focus on the input when it is out of viewport', async () => {
//       Element.prototype.getBoundingClientRect = jest.fn(() => ({
//         top: -100,
//         bottom: 0,
//         left: 0,
//         right: 0,
//       }));
//       await wrapper.vm.showCalendar();
//       wrapper.vm.clickOutside({ target: document.body });
//       const input = wrapper.vm.$refs.input.$el.querySelector('input');
//       expect(document.activeElement).not.toEqual(input);
//     });
//   });
// });

describe('Modal', () => {
  it('closes the datepicker if clicked on overlay', async () => {
    const wrapper = mount(Datepicker, { attachTo: document.body, propsData: { modal: true } });
    await wrapper.vm.showCalendar();
    await wrapper.vm.$nextTick();

    const overlay = wrapper.vm.$refs.overlay;
    overlay.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().closed).toBeTruthy();
    wrapper.unmount();
  });
});

