import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @IsString()
    @ApiProperty({ example: 'The Great Gatsby' })
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'F. Scott Fitzgerald', required: false })
    author?: string;

    @IsNumber()
    @ApiProperty({ example: 19.99 })
    price: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '9780743273565', required: false })
    isbn?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'In Stock', required: false })
    availability?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ example: 'https://images.example.com/book.jpg', required: false })
    imageUrl?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ example: 'https://www.worldofbooks.com/product/123', required: false })
    sourceUrl?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Description of the book', required: false })
    description?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Very Good', required: false })
    condition?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Fiction', required: false })
    category?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '9780743273565', required: false })
    isbn13?: string;
}
