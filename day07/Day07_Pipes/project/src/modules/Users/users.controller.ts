import { Controller, Get, Post, Request, Response, Param, Next, HttpStatus, Body, HttpException, UseFilters } from '@nestjs/common';
import { CreateUserDTO } from './DTO/create-users.dto';
import { UsersService } from '../Users/Services/users.service';
import { ProductsService } from '../Products/Services/products.service';
import { CustomForbiddenException } from '../Shared/ExceptionFilters/forbidden.exception';
import { HttpExceptionFilter } from '../Shared/ExceptionFilters/http-exception.filter';
import { ValidationPipe } from '../Shared/Pipes/validation.pipe';
import { ParseIntPipe } from '../Shared/Pipes/parse-int.pipe';

@Controller()
//@UseFilters(new HttpExceptionFilter())
export class UsersController {

    //依賴注入，建議要使用，這是低耦合作法
    //注入ProductsService
    constructor(private userService: UsersService, private productsService: ProductsService) { }

    @Get('users')
    //使用Express的參數
    async getAllUsers( @Request() req, @Response() res, @Next() next) {
        //Promise 有then catch方法可以調用
        await this.userService.getAllUsers()
            .then((users) => {
                //多種Http的Status可以使用
                res.status(HttpStatus.OK).json(users);
            })
            .catch((error) => {
                console.error(error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            })
    }

    @Get('users/:id')
    //使用Express的參數
    //@Param('id')可以直接抓id參數
    //使用ParseIntPipe
    async getUser( @Response() res, @Param('id', new ParseIntPipe()) id) {
        //id參數前面不帶加號，ParseIntPipe會將參數轉型為int型別
        await this.userService.getUser(id)
            .then((user) => {
                res.status(HttpStatus.OK).json(user);
            })
            .catch((error) => {
                console.error(error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            })
    }

    @Post('users')
    async addUser( @Response() res, @Body(new ValidationPipe()) createUserDTO: CreateUserDTO) {
        //使用Rx.js，所以回傳可以做更多資料流的處理
        await this.userService.addUser(createUserDTO).subscribe((users) => {
            res.status(HttpStatus.OK).json(users);
        })
    }

    //測試ProductsService是否可以正常使用
    @Get('testProducts')
    //使用Express的參數
    async testGetAllProducts( @Request() req, @Response() res, @Next() next) {
        //Promise 有then catch方法可以調用
        await this.productsService.getAllProducts()
            .then((products) => {
                //多種Http的Status可以使用
                res.status(HttpStatus.OK).json(products);
            })
            .catch((error) => {
                console.error(error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            })
    }

    //新增/getException使用HttpException
    @Get('getException')
    //使用HttpExceptionFilter
    async getException(@Request() req, @Response() res, @Next() next){
        //使用CustomForbiddenException
        throw new CustomForbiddenException();
    }
}