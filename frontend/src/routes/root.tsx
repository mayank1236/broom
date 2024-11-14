import { Link, Outlet, useLoaderData } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { getContacts } from "../contacts";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}

export default function Root() {
    const { contacts }: any = useLoaderData();
    return (
      <RecoilRoot>
        <div id="sidebar">
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact: any) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite && <span>★</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div id="detail">
          <Outlet />
        </div>
      </RecoilRoot>
    );
  }
  