import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import Pagination from 'react-bootstrap/Pagination';
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import * as querystring from "node:querystring";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getPaginationNumbers} from "@/pages/_utils";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TQueryParams = {
  page?: string;
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  totalPages: number
  queryParams?: TQueryParams
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch(`http://srv:3000/users?${querystring.stringify(ctx.query)}`, {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, totalPages: 0, users: []}}
    }

    const {users, totalPages} = await res.json()

    return {
      props: {statusCode: 200, users, totalPages, queryParams: ctx.query}
    }
  } catch (e) {
    return {props: {statusCode: 500, totalPages: 0, users: []}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, totalPages, users, queryParams}: TGetServerSideProps) {
  const [currentPage, setCurrentPage] = useState<number>(queryParams?.page ? Number(queryParams.page) : 1)
  const router = useRouter()

  useEffect(() => {
    void router.replace({
      pathname: router.pathname,
      query: {...router.query, page: currentPage}
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  const handleChangePage = (newPage: number) => (): void => {
    setCurrentPage(newPage)
  }

  const paginationNumbers = getPaginationNumbers(currentPage, totalPages)

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First onClick={handleChangePage(1)}
                              disabled={currentPage === 1}/>
            <Pagination.Prev onClick={handleChangePage(currentPage - 1)}
                             disabled={currentPage === 1}/>
            {paginationNumbers.map(number => (
              <Pagination.Item
                key={number}
                onClick={handleChangePage(number)}
                active={currentPage === number}>{number}</Pagination.Item>
            ))}
            <Pagination.Next onClick={handleChangePage(currentPage + 1)}
                             disabled={currentPage === totalPages}/>
            <Pagination.Last onClick={handleChangePage(totalPages)}
                             disabled={currentPage === totalPages}/>
          </Pagination>

        </Container>
      </main>
    </>
  );
}
