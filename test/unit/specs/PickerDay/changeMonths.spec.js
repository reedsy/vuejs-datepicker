import PickerDay from '@/components/PickerDay.vue';
import { shallowMount } from '@vue/test-utils';
import { en } from '@/locale';

describe('PickerDay: changing months', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        translation: en,
        allowedToShowView: () => true,
        selectedDate: new Date(2018, 1, 24),
        focusedDate: new Date(2018, 1, 24).getTime(),
        pageDate: new Date(2018, 1, 1),
      },
    });
  });

  it('can set the next month', () => {
    wrapper.vm.nextMonth();
    expect(wrapper.emitted().changedMonth).toBeTruthy();
    expect(wrapper.emitted().changedMonth[0][0].getMonth()).toEqual(2);
  });

  it('can set the previous month', () => {
    wrapper.vm.previousMonth();
    expect(wrapper.emitted().changedMonth).toBeTruthy();
    expect(wrapper.emitted().changedMonth[0][0].getMonth()).toEqual(0);
  });

  it('changes the focused date to the next month and resets the day', () => {
    wrapper.vm.nextMonth();
    expect(wrapper.emitted('update:focusedDate')).toBeTruthy();
    expect(wrapper.emitted('update:focusedDate')[0]).toEqual([ new Date(2018, 2, 1).getTime() ]);
  });

  it('changes the focused date to the previous month and resets the day', () => {
    wrapper.vm.previousMonth();
    expect(wrapper.emitted('update:focusedDate')).toBeTruthy();
    expect(wrapper.emitted('update:focusedDate')[0]).toEqual([ new Date(2018, 0, 1).getTime() ]);
  });

  it('changes the month when the datepicker is side-by-side and the focus is on the first month', async () => {
    await wrapper.setProps({
      sideBySide: true,
    });
    wrapper.vm.nextMonth();
    expect(wrapper.emitted().changedMonth).toBeTruthy();
    expect(wrapper.emitted().changedMonth[0][0].getMonth()).toEqual(2);
  });
});
