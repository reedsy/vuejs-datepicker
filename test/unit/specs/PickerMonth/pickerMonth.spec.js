import PickerMonth from '@/components/PickerMonth.vue';
import { shallowMount } from '@vue/test-utils';
import { en } from '@/locale';

describe('PickerMonth', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PickerMonth, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
        focusedDate: new Date(2018, 2, 24).getTime(),
      },
    });
  });

  it('knows the selected month', async () => {
    const newDate = new Date(2016, 9, 15);
    await wrapper.setProps({
      selectedDate: newDate,
    });
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true);
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false);
  });

  it('can set the next year', () => {
    wrapper.vm.nextYear();
    expect(wrapper.emitted().changedYear[0][0].getFullYear()).toEqual(2019);
  });

  it('can set the previous year', () => {
    wrapper.vm.previousYear();
    expect(wrapper.emitted().changedYear[0][0].getFullYear()).toEqual(2017);
  });

  it('Sets the aria-modal attribute to true for the wrapper if it is not inline', async () => {
    await wrapper.setProps({
      inline: false,
    });
    expect(wrapper.attributes('aria-modal')).toBe('true');
  });

  it('Sets the aria-modal attribute to false for the wrapper if it is inline', async () => {
    await wrapper.setProps({
      inline: true,
    });
    expect(wrapper.attributes('aria-modal')).toBe('false');
  });

  it('emits date on selection', () => {
    const time = new Date().getTime();
    wrapper.vm.selectMonth({ timestamp: time });
    expect(wrapper.emitted().selectMonth).toBeTruthy();
    expect(wrapper.emitted().selectMonth[0][0].timestamp).toEqual(time);
  });

  it('emits show year calendar event when clicked on the year', () => {
    const yearBtn = wrapper.find('.month__year_btn');
    yearBtn.trigger('click');
    expect(wrapper.emitted().showYearCalendar).toBeTruthy();
  });
});
