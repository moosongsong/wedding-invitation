import { useState } from 'react';
import { Section } from '../common/Section';
import { activeVariant, bride, groom } from '../../data/invitation';
import type { Person } from '../../types';
import styles from './Invitation.module.css';

interface ContactPerson {
  relation: string;
  name: string;
  phone: string;
}

function buildContacts(person: Person): ContactPerson[] {
  const label = person.role === 'groom' ? '신랑' : '신부';
  return [
    { relation: label, name: person.name, phone: person.phone },
    { relation: '아버지', name: person.father, phone: person.fatherPhone },
    { relation: '어머니', name: person.mother, phone: person.motherPhone },
  ];
}

// 부모님 · 아들/딸 한 줄
function ParentRow({ person }: { person: Person }) {
  const relation = person.role === 'groom' ? '아들' : '딸';
  return (
    <p className={styles.parentRow}>
      <span className={styles.parentNames}>
        {person.father} · {person.mother}
      </span>
      <span className={styles.relation}>의 {relation}</span>
      <b className={styles.childName}>{person.name}</b>
    </p>
  );
}

// 초대 인사말 + 양가 혼주 소개 + 연락하기
export function Invitation() {
  const [open, setOpen] = useState(false);
  const invitationMessage = activeVariant.invitation;
  const contacts: { label: string; people: ContactPerson[] }[] = [
    { label: '신랑측', people: buildContacts(groom) },
    { label: '신부측', people: buildContacts(bride) },
  ];

  return (
    <Section alt>
      <div className={styles.invitation}>
        <div className={styles.ornament}>❧</div>

        {invitationMessage.poem.length > 0 && (
          <p className={styles.poem}>
            {invitationMessage.poem.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}
        {invitationMessage.poemAuthor && (
          <p className={styles.poemAuthor}>{invitationMessage.poemAuthor}</p>
        )}

        <p className={styles.message}>
          {invitationMessage.message.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>

        <div className={styles.parents}>
          <ParentRow person={groom} />
          <ParentRow person={bride} />
        </div>

        <button className={styles.contact} onClick={() => setOpen(true)}>
          📞 연락하기
        </button>
      </div>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <p className={styles.sheetTitle}>축하의 마음을 전해보세요</p>
            {contacts.map((group) => (
              <div key={group.label} className={styles.contactGroup}>
                <p className={styles.contactGroupLabel}>{group.label}</p>
                {group.people.map((c) => (
                  <div key={c.name} className={styles.contactItem}>
                    <span className={styles.contactName}>
                      <small>{c.relation}</small>
                      {c.name}
                    </span>
                    <span className={styles.contactActions}>
                      <a className={styles.iconBtn} href={`tel:${c.phone}`}>
                        📞
                      </a>
                      <a className={styles.iconBtn} href={`sms:${c.phone}`}>
                        ✉️
                      </a>
                    </span>
                  </div>
                ))}
              </div>
            ))}
            <button className={styles.close} onClick={() => setOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
