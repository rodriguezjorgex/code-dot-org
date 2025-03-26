import {
  CheckboxDropdown,
  SimpleDropdown,
} from '@code-dot-org/component-library/dropdown';
import FormFieldWrapper from '@code-dot-org/component-library/formFieldWrapper';
import Tags from '@code-dot-org/component-library/tags';
import TextField from '@code-dot-org/component-library/textField';
import {Heading2} from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import React, {ChangeEvent, FC, useMemo} from 'react';

import {useFetch} from '@cdo/apps/util/useFetch';
import {StudentGradeLevels} from '@cdo/generated-scripts/sharedConstants';

import {BasicsProps, CourseOffering} from '../types';

import commonStyles from '../styles.module.scss';

export const Basics: FC<BasicsProps> = ({
  config: {fields},
  name,
  grades,
  subject,
  prereq,
  hasPrereq,
  capacity,
  description,
  courseOfferings,
  handleChange,
}) => {
  const {data: fetchedCourseOfferings} = useFetch<CourseOffering[]>(
    fields.course_offerings
      ? '/course_offerings/self_paced_pl_course_offerings'
      : ''
  );

  const courseOfferingsById = useMemo(
    () =>
      fetchedCourseOfferings?.reduce(
        (acc: Record<number, CourseOffering>, curr) => {
          acc[curr.id] = curr;
          return acc;
        },
        {}
      ),
    [fetchedCourseOfferings]
  );

      });
    } else {
      selectedGrades = selectedGrades.filter(g => g !== e.target.value);
    }
    handleChange({grades: selectedGrades});
  };

  const handleRemoveCourseOffering = useCallback(
    (offeringId: string) => () => {
      dispatchWorkshop({
        type: 'REMOVE_COURSE_OFFERING',
        payload: offeringId,
      });
    },
    [dispatchWorkshop]
  );

  const subjectOptions = useMemo(() => {
    let options = [{value: '', text: 'Select a subject'}];
    if (fields.subject?.options) {
      options = options.concat(
        fields.subject.options.map(({value, label}) => ({value, text: label}))
      );
    }
    return options;
  }, [fields.subject?.options]);

  return (
    <>
      <Heading2 visualAppearance="heading-sm">Workshop Basics</Heading2>
      <div className={commonStyles.row}>
        {fields.name && (
          <TextField
            name="name"
            onChange={e => handleChange({name: e.target.value})}
            value={name}
            label="Workshop name"
            size="s"
            className={classNames(commonStyles.item, {
              [commonStyles.required]: fields.name.required,
            })}
          />
        )}
        {fields.grades && (
          <CheckboxDropdown
            name="grades"
            onChange={handleGradesChange}
            styleAsFormField={true}
            hideControls
            checkedOptions={grades}
            allOptions={StudentGradeLevels.map(value => ({
              value,
              label: value,
            }))}
            labelText="Grade levels"
            size="s"
            helperMessage="Select applicable grade levels for this workshop."
            className={classNames(commonStyles.item, {
              [commonStyles.required]: fields.grades.required,
            })}
          />
        )}
        {fields.subject && (
          <SimpleDropdown
            name="subject"
            onChange={e => handleChange({subject: e.target.value})}
            styleAsFormField={true}
            items={subjectOptions}
            selectedValue={subject}
            labelText="Subject"
            size="s"
            dropdownTextThickness="thin"
            className={classNames(commonStyles.item, {
              [commonStyles.required]: fields.subject.required,
            })}
          />
        )}
      </div>
      <div className={commonStyles.row}>
        {fields.prereq && (
          <SimpleDropdown
            name="has-prereq"
            onChange={e => {
              const updatedHasPrereq = e.target.value === 'true';
              handleChange({
                hasPrereq: updatedHasPrereq,
                prereq: updatedHasPrereq ? prereq : '',
              });
            }}
            styleAsFormField={true}
            items={[
              {value: 'true', text: 'Has prerequisites'},
              {value: 'false', text: 'No experience needed'},
            ]}
            selectedValue={hasPrereq.toString()}
            labelText="Experience needed"
            helperMessage="Indicate if this workshop requires previous experience."
            size="s"
            dropdownTextThickness="thin"
            className={classNames(commonStyles.item, {
              [commonStyles.required]: fields.prereq.required,
            })}
          />
        )}
        {fields.capacity && (
          <TextField
            inputType="number"
            name="capacity"
            onChange={e => handleChange({capacity: e.target.value})}
            value={capacity?.toString()}
            label="Capacity"
            helperMessage="Maximum number of attendees allowed."
            size="s"
            className={classNames(commonStyles.item, {
              [commonStyles.required]: fields.capacity.required,
            })}
          />
        )}
        {/* empty space aligns with optional subject */}
        {subject && <div className={commonStyles.item} />}
      </div>
      <div className={commonStyles.row}>
        {fields.prereq && hasPrereq && (
          <div className={commonStyles.card}>
            <TextField
              name="prereq"
              onChange={e => handleChange({prereq: e.target.value})}
              value={prereq}
              label="Workshop prerequisites"
              size="s"
              className={classNames(commonStyles.item, {
                [commonStyles.required]: fields.prereq.required,
              })}
            />
          </div>
        )}
      </div>
      <div className={commonStyles.row}>
        {description && (
          <FormFieldWrapper
            label="Workshop description"
            helperMessage="Public-facing summary to attract and inform participants."
            size="s"
            className={classNames(commonStyles.item, commonStyles.required)}
          >
            <textarea
              id="description"
              name="description"
              onChange={e => handleChange({description: e.target.value})}
              value={description}
              placeholder="Enter description here"
            />
          </FormFieldWrapper>
        )}
      </div>
      <div className={commonStyles.row}>
        {fields.course_offerings && (
          <CheckboxDropdown
            name="course_offerings"
            onChange={handleCourseOfferingsChange}
            onSelectAll={() =>
              handleChange({
                courseOfferings:
                  fetchedCourseOfferings?.map(({id}) => id.toString()) ?? [],
              })
            }
            selectAllText="Select all"
            clearAllText="Clear all"
            onClearAll={() => {
              handleChange({courseOfferings: []});
            }}
            styleAsFormField={true}
            checkedOptions={courseOfferings}
            allOptions={
              fetchedCourseOfferings?.map(({id, display_name}) => ({
                value: id.toString(),
                label: display_name,
              })) ?? []
            }
            labelText="Select workshop topic(s)"
            size="s"
            className={classNames(commonStyles.item, {
              [commonStyles.required]: fields.course_offerings.required,
            })}
          />
        )}
      </div>
      {courseOfferingsById && (
        <Tags
          className={commonStyles.wrapContainer}
          tagsList={courseOfferings.map(offeringId => ({
            type: 'closable',
            onClose: handleRemoveCourseOffering(offeringId),
            label: courseOfferingsById[Number(offeringId)]?.display_name ?? '',
          }))}
        />
      )}
    </>
  );
};
